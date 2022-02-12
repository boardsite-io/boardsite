import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { pick, keys, assign, cloneDeep } from "lodash"
import { Stroke } from "drawing/stroke/index.types"
import {
    addAction,
    deleteStrokes,
    redoAction,
    undoAction,
    addOrUpdateStrokes,
    addPages,
    deletePages,
    clearPages,
    updatePages,
} from "./undoredo"
import { newState } from "./state"
import {
    AddAttachments,
    AddPageData,
    AddPages,
    AddStrokes,
    BoardState,
    ClearPages,
    DeleteAttachments,
    DeletePages,
    EraseStrokes,
    JumpToPageWithIndex,
    LoadBoardState,
    MoveShapesToDragLayer,
    Page,
    SetPageMeta,
    SyncPages,
} from "./index.types"

const boardSlice = createSlice({
    name: "board",
    initialState: newState(),
    reducers: {
        LOAD_BOARD_STATE: (state, action: PayloadAction<LoadBoardState>) => {
            assign(state, pick(action.payload, keys(state)))
        },

        SYNC_PAGES: (state, action: PayloadAction<SyncPages>) => {
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection

            // Adjust view if necessary
            if (state.currentPageIndex > pageRank.length - 1) {
                state.currentPageIndex = pageRank.length - 1
                // initialView(state)
            }

            state.triggerStrokesRender?.()
        },

        SET_PAGEMETA: (state, action: PayloadAction<SetPageMeta>) => {
            const {
                data: pageUpdates,
                isRedoable,
                sessionHandler,
                sessionUndoHandler,
            } = action.payload

            // make a copy of old page meta
            const pages = pageUpdates.map((page) =>
                cloneDeep(
                    pick(state.pageCollection[page.pageId], ["pageId", "meta"])
                )
            ) as Page[]

            const handler = (boardState: BoardState) => {
                updatePages(boardState, ...pageUpdates)
                sessionHandler?.()
            }

            const undoHandler = (boardState: BoardState) => {
                updatePages(boardState, ...pages)
                sessionUndoHandler?.(...pages)
            }

            addAction({
                handler,
                undoHandler,
                stack: state.undoStack,
                isRedoable,
                state,
                isNew: true,
            })

            state.triggerStrokesRender?.()
        },

        ADD_PAGES: (state, action: PayloadAction<AddPages>) => {
            const {
                data: addPageData,
                isRedoable,
                sessionHandler,
                sessionUndoHandler,
            } = action.payload

            const handler = (boardState: BoardState) => {
                addPages(boardState, ...addPageData)
                sessionHandler?.()
            }

            const undoHandler = (boardState: BoardState) => {
                const pageIds = addPageData.map(({ page }) => page.pageId)
                deletePages(boardState, ...pageIds)
                sessionUndoHandler?.()
            }

            addAction({
                handler,
                undoHandler,
                stack: state.undoStack,
                isRedoable,
                state,
                isNew: true,
            })

            state.triggerStrokesRender?.()
        },

        CLEAR_PAGES: (state, action: PayloadAction<ClearPages>) => {
            const {
                data: pageIds,
                isRedoable,
                sessionHandler,
                sessionUndoHandler,
            } = action.payload

            // make a copy of cleared strokes
            const strokes = pageIds
                .map((pid) => cloneDeep(state.pageCollection[pid]))
                .filter((page) => page !== undefined)
                .reduce<Stroke[]>(
                    (arr, page) =>
                        arr.concat(Object.values((page as Page).strokes)),
                    []
                )

            const handler = (boardState: BoardState) => {
                clearPages(boardState, ...pageIds)
                sessionHandler?.()
            }

            const undoHandler = (boardState: BoardState) => {
                addOrUpdateStrokes(boardState, ...strokes)
                sessionUndoHandler?.(...strokes)
            }

            addAction({
                handler,
                undoHandler,
                stack: state.undoStack,
                isRedoable,
                state,
                isNew: true,
            })

            state.triggerStrokesRender?.()
        },

        DELETE_PAGES: (state, action: PayloadAction<DeletePages>) => {
            const {
                data: pageIds,
                isRedoable,
                sessionHandler,
                sessionUndoHandler,
            } = action.payload

            const addPageData = pageIds
                .map<AddPageData>((pid) => ({
                    page: state.pageCollection[pid] as Page,
                }))
                .filter(({ page }) => page !== undefined)
            const pageRank = [...state.pageRank]

            const handler = (boardState: BoardState) => {
                deletePages(boardState, ...pageIds)
                sessionHandler?.()
            }

            const undoHandler = (boardState: BoardState) => {
                // set pagerank manually as it was before deletion
                boardState.pageRank = pageRank
                addPages(boardState, ...addPageData)
                sessionUndoHandler?.(...addPageData)
            }

            addAction({
                handler,
                undoHandler,
                stack: state.undoStack,
                isRedoable,
                state,
                isNew: true,
            })

            if (!state.pageRank.length) {
                // All pages have been deleted so view and index can be reset
                state.currentPageIndex = 0
            } else if (state.currentPageIndex > state.pageRank.length - 1) {
                // Deletions have caused the current page index to exceed
                // the page limit, therefore we move to the last page
                state.currentPageIndex = state.pageRank.length - 1
            }

            // Make sure that transform is cleared when page is deleted
            state.clearTransform?.()
            state.triggerStrokesRender?.()
        },

        // Reset everything except page meta settings
        DELETE_ALL_PAGES: () => ({
            ...newState(),
        }),

        CLEAR_UNDO_REDO: (state) => {
            state.undoStack = []
            state.redoStack = []
        },

        CLEAR_TRANSFORM: (state) => {
            state.clearTransform?.()
        },

        // sets the currently selected strokes
        SET_TRANSFORM_STROKES: (
            state,
            action: PayloadAction<MoveShapesToDragLayer>
        ) => {
            const strokes = action.payload
            state.transformStrokes = strokes
        },

        // Add strokes to collection
        ADD_STROKES: (state, action: PayloadAction<AddStrokes>) => {
            const {
                data: strokes,
                isRedoable,
                sessionHandler,
                sessionUndoHandler,
                isUpdate,
            } = action.payload

            strokes.sort((a, b) => ((a.id ?? "") > (b.id ?? "") ? 1 : -1))

            const handler = (boardState: BoardState) => {
                addOrUpdateStrokes(boardState, ...strokes)
                sessionHandler?.()
            }

            let undoHandler = (boardState: BoardState) => {
                deleteStrokes(boardState, ...strokes)
                sessionUndoHandler?.()
            }

            if (isUpdate) {
                const addUpdateStartPoint = state.undoStack?.pop()?.handler

                if (addUpdateStartPoint) {
                    undoHandler = addUpdateStartPoint
                }
            }

            addAction({
                handler,
                undoHandler,
                stack: state.undoStack,
                isRedoable,
                state,
                isNew: true,
            })

            state.triggerStrokesRender?.()
        },

        // Erase strokes from collection
        ERASE_STROKES(state, action: PayloadAction<EraseStrokes>) {
            const {
                data: strokes,
                isRedoable,
                sessionHandler,
                sessionUndoHandler,
            } = action.payload

            const handler = (boardState: BoardState) => {
                deleteStrokes(boardState, ...strokes)
                sessionHandler?.()
            }

            const undoHandler = (boardState: BoardState) => {
                addOrUpdateStrokes(boardState, ...strokes)
                sessionUndoHandler?.()
            }

            addAction({
                handler,
                undoHandler,
                stack: state.undoStack,
                isRedoable,
                state,
                isNew: true,
            })

            state.triggerStrokesRender?.()
        },

        ADD_ATTACHMENTS: (state, action: PayloadAction<AddAttachments>) => {
            const attachments = action.payload
            attachments.forEach((attachment) => {
                state.attachments[attachment.id] = attachment
            })
        },

        DELETE_ATTACHMENTS: (
            state,
            action: PayloadAction<DeleteAttachments>
        ) => {
            const attachIds = action.payload
            attachIds.forEach((attachId) => {
                delete state.attachments[attachId]
            })
        },

        CLEAR_ATTACHMENTS: (state) => {
            state.attachments = {}
        },

        UNDO_ACTION: (state) => {
            undoAction(state as BoardState)
            state.triggerStrokesRender?.()
        },

        REDO_ACTION: (state) => {
            redoAction(state as BoardState)
            state.triggerStrokesRender?.()
        },

        DECREMENT_PAGE_INDEX: (state) => {
            state.currentPageIndex -= 1
            state.clearTransform?.()
        },

        INCREMENT_PAGE_INDEX: (state) => {
            state.currentPageIndex += 1
            state.clearTransform?.()
        },

        JUMP_TO_NEXT_PAGE: (state) => {
            if (state.currentPageIndex < state.pageRank.length - 1) {
                state.currentPageIndex += 1
            }
        },

        JUMP_TO_PREV_PAGE: (state) => {
            if (state.currentPageIndex > 0) {
                state.currentPageIndex -= 1
            }
        },

        JUMP_TO_FIRST_PAGE: (state) => {
            state.currentPageIndex = 0
        },

        JUMP_TO_LAST_PAGE: (state) => {
            state.currentPageIndex = state.pageRank.length - 1
        },

        JUMP_TO_PAGE_WITH_INDEX: (
            state,
            action: PayloadAction<JumpToPageWithIndex>
        ) => {
            const targetIndex = action.payload

            if (targetIndex <= state.pageRank.length - 1 && targetIndex >= 0) {
                state.currentPageIndex = targetIndex
            }
            state.triggerStageRender?.()
        },

        TOGGLE_SHOULD_CENTER: (state) => {
            state.view.keepCentered = !state.view.keepCentered
        },

        TRIGGER_BOARD_RERENDER: (state) => {
            state.triggerStrokesRender?.()
        },
    },
})

export const {
    LOAD_BOARD_STATE,
    SYNC_PAGES,
    ADD_PAGES,
    SET_PAGEMETA,
    CLEAR_PAGES,
    DELETE_PAGES,
    DELETE_ALL_PAGES,
    SET_TRANSFORM_STROKES,
    ADD_STROKES,
    ERASE_STROKES,
    ADD_ATTACHMENTS,
    DELETE_ATTACHMENTS,
    CLEAR_ATTACHMENTS,
    UNDO_ACTION,
    REDO_ACTION,
    CLEAR_UNDO_REDO,
    CLEAR_TRANSFORM,
    DECREMENT_PAGE_INDEX,
    INCREMENT_PAGE_INDEX,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_LAST_PAGE,
    JUMP_TO_PAGE_WITH_INDEX,
    TOGGLE_SHOULD_CENTER,
    TRIGGER_BOARD_RERENDER,
} = boardSlice.actions
export default boardSlice.reducer
