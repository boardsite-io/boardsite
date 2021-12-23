import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { pick, keys, assign } from "lodash"
import {
    centerView,
    fitToPage,
    initialView,
    resetView,
    zoomCenter,
} from "board/stage/util/adjustView"
import {
    addAction,
    deleteStrokes,
    redoAction,
    undoAction,
    addOrUpdateStrokes,
} from "./undoredo"
import { newState } from "./state"
import {
    AddPage,
    AddStrokes,
    BoardState,
    ClearPage,
    DeletePages,
    EraseStrokes,
    JumpToPageWithIndex,
    LoadBoardState,
    MoveShapesToDragLayer,
    NextPage,
    PrevPage,
    SetPageBackground,
    SetPageMeta,
    SetPageRank,
    SetPageSize,
    SetPdf,
    SetStageAttrs,
    SyncAllPages,
} from "./board.types"
import { clearTransform } from "./helpers"

const boardSlice = createSlice({
    name: "board",
    initialState: newState(),
    reducers: {
        LOAD_BOARD_STATE: (state, action: PayloadAction<LoadBoardState>) => {
            assign(state, pick(action.payload, keys(state)))
        },

        SYNC_ALL_PAGES: (state, action: PayloadAction<SyncAllPages>) => {
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection
            state.triggerManualUpdate?.()
        },

        SET_PAGERANK: (state, action: PayloadAction<SetPageRank>) => {
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection
            state.triggerManualUpdate?.()
        },

        SET_PAGEMETA: (state, action: PayloadAction<SetPageMeta>) => {
            const { pageId, meta } = action.payload
            state.pageCollection[pageId]?.updateMeta(meta)
            state.triggerManualUpdate?.()
        },

        SET_PAGE_BACKGROUND: (
            state,
            action: PayloadAction<SetPageBackground>
        ) => {
            const style = action.payload
            state.pageMeta.background.style = style
        },

        SET_PAGE_SIZE: (state, action: PayloadAction<SetPageSize>) => {
            state.pageMeta.size = action.payload
            state.triggerManualUpdate?.()
        },

        ADD_PAGE: (state, action: PayloadAction<AddPage>) => {
            const { page, index } = action.payload
            state.pageCollection[page.pageId] = page

            if (index >= 0) {
                state.pageRank.splice(index, 0, page.pageId)
            } else {
                state.pageRank.push(page.pageId)
            }

            state.triggerManualUpdate?.()
            initialView(state)
        },

        CLEAR_PAGE: (state, action: PayloadAction<ClearPage>) => {
            const pageId = action.payload
            state.pageCollection[pageId]?.clear()
            state.triggerManualUpdate?.()
        },

        DELETE_PAGES: (state, action: PayloadAction<DeletePages>) => {
            const pageIds = action.payload

            pageIds.forEach((pid) => {
                const { documentPageNum } =
                    state.pageCollection[pid].meta.background

                if (documentPageNum) {
                    state.documentImages.splice(documentPageNum, 1)
                }

                state.pageRank.splice(state.pageRank.indexOf(pid), 1)
                delete state.pageCollection[pid]
                state.triggerManualUpdate?.()
            })

            // Set view to previous page after deletion
            if (state.currentPageIndex > 0) {
                state.currentPageIndex -= 1
                initialView(state)
            }
        },

        // Keep page meta settings
        DELETE_ALL_PAGES: (state) => ({
            ...newState(),
            pageMeta: state.pageMeta,
        }),

        CLEAR_DOCS: (state) => {
            state.documentImages = []
            state.documentSrc = ""
        },

        CLEAR_TRANSFORM: (state) => {
            clearTransform(state)
        },

        // sets the currently selected strokes
        MOVE_SHAPES_TO_DRAG_LAYER: (
            state,
            action: PayloadAction<MoveShapesToDragLayer>
        ) => {
            const { strokes, pagePosition } = action.payload

            if (pagePosition) {
                state.transformPagePosition = pagePosition
            }

            state.transformStrokes = strokes
        },

        // Add strokes to collection
        ADD_STROKES: (state, action: PayloadAction<AddStrokes>) => {
            const {
                strokes,
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
                const addUpdateStartPoint = state.undoStack?.pop()?.handleFunc

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

            state.triggerManualUpdate?.()
        },

        // Erase strokes from collection
        ERASE_STROKES(state, action: PayloadAction<EraseStrokes>) {
            const { strokes, isRedoable, sessionHandler, sessionUndoHandler } =
                action.payload

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

            state.triggerManualUpdate?.()
        },

        SET_PDF: (state, action: PayloadAction<SetPdf>) => {
            const { documentImages, documentSrc } = action.payload
            state.documentImages = documentImages
            state.documentSrc = documentSrc
        },

        UNDO_ACTION: (state) => {
            undoAction(state as BoardState)
            state.triggerManualUpdate?.()
        },

        REDO_ACTION: (state) => {
            redoAction(state as BoardState)
            state.triggerManualUpdate?.()
        },

        NEXT_PAGE: (state, action: PayloadAction<NextPage>) => {
            if (state.currentPageIndex < state.pageRank.length - 1) {
                state.currentPageIndex += 1

                assign(
                    state.stage.attrs,
                    pick(action.payload.attrs, keys(state.stage.attrs))
                )

                clearTransform(state)

                state.stage.renderTrigger = !state.stage.renderTrigger
            }
        },

        PREV_PAGE: (state, action: PayloadAction<PrevPage>) => {
            if (state.currentPageIndex > 0) {
                state.currentPageIndex -= 1

                assign(
                    state.stage.attrs,
                    pick(action.payload.attrs, keys(state.stage.attrs))
                )

                clearTransform(state)

                state.stage.renderTrigger = !state.stage.renderTrigger
            }
        },

        JUMP_TO_NEXT_PAGE: (state) => {
            if (state.currentPageIndex < state.pageRank.length - 1) {
                state.currentPageIndex += 1
                initialView(state)
            }
        },

        JUMP_TO_PREV_PAGE: (state) => {
            if (state.currentPageIndex > 0) {
                state.currentPageIndex -= 1
                initialView(state)
            }
        },

        JUMP_TO_FIRST_PAGE: (state) => {
            state.currentPageIndex = 0
            initialView(state)
        },

        JUMP_TO_LAST_PAGE: (state) => {
            state.currentPageIndex = state.pageRank.length - 1
            initialView(state)
        },

        JUMP_TO_PAGE_WITH_INDEX: (
            state,
            action: PayloadAction<JumpToPageWithIndex>
        ) => {
            const targetIndex = action.payload

            if (targetIndex <= state.pageRank.length - 1 && targetIndex >= 0) {
                state.currentPageIndex = targetIndex
            }
            state.stage.renderTrigger = !state.stage.renderTrigger
        },

        TOGGLE_SHOULD_CENTER: (state) => {
            state.stage.keepCentered = !state.stage.keepCentered
        },

        TOGGLE_HIDE_NAVBAR: (state) => {
            state.stage.hideNavBar = !state.stage.hideNavBar
        },

        RESET_VIEW: (state) => {
            resetView(state)
        },

        SET_STAGE_ATTRS: (state, action: PayloadAction<SetStageAttrs>) => {
            assign(
                state.stage.attrs,
                pick(action.payload, keys(state.stage.attrs))
            )
        },

        ON_WINDOW_RESIZE: (state) => {
            state.stage.attrs.width = window.innerWidth
            state.stage.attrs.height = window.innerHeight
            centerView(state)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },

        FIT_WIDTH_TO_PAGE: (state) => {
            fitToPage(state)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },

        ZOOM_IN_CENTER: (state) => {
            zoomCenter(state, true)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },

        ZOOM_OUT_CENTER: (state) => {
            zoomCenter(state, false)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },

        TRIGGER_BOARD_RERENDER: (state) => {
            state.triggerManualUpdate?.()
        },
    },
})

export const {
    SYNC_ALL_PAGES,
    SET_PAGERANK,
    ADD_PAGE,
    SET_PAGEMETA,
    CLEAR_PAGE,
    DELETE_PAGES,
    DELETE_ALL_PAGES,
    MOVE_SHAPES_TO_DRAG_LAYER,
    ADD_STROKES,
    ERASE_STROKES,
    SET_PDF,
    UNDO_ACTION,
    REDO_ACTION,
    CLEAR_DOCS,
    CLEAR_TRANSFORM,
    SET_PAGE_BACKGROUND,
    SET_PAGE_SIZE,
    PREV_PAGE,
    NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_LAST_PAGE,
    JUMP_TO_PAGE_WITH_INDEX,
    TOGGLE_SHOULD_CENTER,
    TOGGLE_HIDE_NAVBAR,
    RESET_VIEW,
    ON_WINDOW_RESIZE,
    SET_STAGE_ATTRS,
    FIT_WIDTH_TO_PAGE,
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
    TRIGGER_BOARD_RERENDER,
} = boardSlice.actions
export default boardSlice.reducer
