import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { pick, keys, assign, cloneDeep } from "lodash"
import { Point, Stroke } from "drawing/stroke/types"
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
import { BoardState, Page, StageAttrs, StrokeAction } from "./board.types"

const boardSlice = createSlice({
    name: "board",
    initialState: newState(),
    reducers: {
        LOAD_BOARD_STATE: (state, action) => {
            assign(state, pick(action.payload, keys(state)))
        },

        SYNC_ALL_PAGES: (state, action) => {
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection
            state.triggerManualUpdate?.()
        },

        SET_PAGERANK: (state, action) => {
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection
            state.triggerManualUpdate?.()
        },

        SET_PAGEMETA: (state, action) => {
            const { pageId, meta } = action.payload
            state.pageCollection[pageId]?.updateMeta(meta)
            state.triggerManualUpdate?.()
        },

        SET_PAGE_BACKGROUND: (state, action) => {
            const style = action.payload
            state.pageSettings.background = style
        },

        SET_PAGE_SIZE: (state, action) => {
            state.pageSettings.size = action.payload
            state.triggerManualUpdate?.()
        },

        ADD_PAGE: (state, action) => {
            const { page, index } = action.payload as {
                page: Page
                index: number
            }
            state.pageCollection[page.pageId] = page
            if (index >= 0) {
                state.pageRank.splice(index, 0, page.pageId)
            } else {
                state.pageRank.push(page.pageId)
            }
            state.triggerManualUpdate?.()
            initialView(state)
        },

        CLEAR_PAGE: (state, action) => {
            const pageId = action.payload
            state.pageCollection[pageId]?.clear()
            state.triggerManualUpdate?.()
        },

        DELETE_PAGES: (state, action) => {
            const pageIds: string[] = action.payload
            pageIds.forEach((pid) => {
                state.pageRank.splice(state.pageRank.indexOf(pid), 1)
                state.documentImages.splice(
                    state.pageCollection[pid].meta.background.documentPageNum,
                    1
                )
                delete state.pageCollection[pid]
                state.triggerManualUpdate?.()
            })
        },

        // removes all pages but leaves the document
        DELETE_ALL_PAGES: (state) => {
            state.pageRank = []
            state.triggerManualUpdate?.()
            state.pageCollection = {}
        },

        CLEAR_DOCS: (state) => {
            state.documentImages = []
            state.documentSrc = ""
        },

        CLEAR_TRANSFORM: (state) => {
            state.transformStrokes = []
            state.strokeUpdates = []
        },

        // sets the currently selected strokes
        MOVE_SHAPES_TO_DRAG_LAYER: (
            state,
            action: PayloadAction<{
                strokes: Stroke[]
                pagePosition?: Point
            }>
        ) => {
            const { strokes, pagePosition } = action.payload
            if (pagePosition) {
                state.transformPagePosition = pagePosition
            }
            state.transformStrokes = strokes
        },

        // Add strokes to collection
        ADD_STROKES: (state, action: PayloadAction<StrokeAction>) => {
            const { strokes, isRedoable, sessionHandler, sessionUndoHandler } =
                action.payload

            strokes.sort((a, b) => ((a.id ?? "") > (b.id ?? "") ? 1 : -1))

            const handler = (boardState: BoardState) => {
                addOrUpdateStrokes(boardState, ...strokes)
                sessionHandler?.()
            }
            const undoHandler = (boardState: BoardState) => {
                deleteStrokes(boardState, ...strokes)
                sessionUndoHandler?.()
            }
            addAction(
                handler,
                undoHandler,
                state as BoardState,
                state.undoStack,
                isRedoable
            )

            state.triggerManualUpdate?.()
        },

        // Erase strokes from collection
        ERASE_STROKES(state, action) {
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
            addAction(
                handler,
                undoHandler,
                state as BoardState,
                state.undoStack,
                isRedoable
            )

            state.triggerManualUpdate?.()
        },

        // removes strokes in order to correctly display move transformer
        UPDATE_DELETE_STROKES(state, action: PayloadAction<StrokeAction>) {
            const strokes = action.payload.strokes as Stroke[]
            // make copy to save the old stroke position
            state.strokeUpdates = strokes.map((s) => s.serializeUpdate())
            deleteStrokes(state, ...strokes)
            state.triggerManualUpdate?.()
        },

        // Update stroke position after dragging
        UPDATE_STROKES(state, action: PayloadAction<StrokeAction>) {
            const { strokes, isRedoable, sessionHandler, sessionUndoHandler } =
                action.payload
            const updatesCopy = cloneDeep(state.strokeUpdates)

            const handler = (boardState: BoardState) => {
                // copy to not mutate the reference
                const strokesCopy = cloneDeep(strokes)
                addOrUpdateStrokes(boardState, ...strokesCopy)
                sessionHandler?.(...strokesCopy)
            }
            const undoHandler = (boardState: BoardState) => {
                addOrUpdateStrokes(boardState, ...updatesCopy)
                sessionUndoHandler?.(...updatesCopy)
            }
            addAction(
                handler,
                undoHandler,
                state as BoardState,
                state.undoStack,
                isRedoable
            )

            state.triggerManualUpdate?.()
        },

        SET_PDF: (state, action) => {
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

        JUMP_TO_NEXT_PAGE: (state, action: PayloadAction<boolean>) => {
            if (state.currentPageIndex < state.pageRank.length - 1) {
                state.currentPageIndex += 1

                if (action.payload) {
                    initialView(state)
                    state.stage.renderTrigger = !state.stage.renderTrigger
                }
            }
        },
        JUMP_TO_PREV_PAGE: (state, action: PayloadAction<boolean>) => {
            if (state.currentPageIndex > 0) {
                state.currentPageIndex -= 1

                if (action.payload) {
                    initialView(state)
                    state.stage.renderTrigger = !state.stage.renderTrigger
                }
            }
        },
        JUMP_TO_FIRST_PAGE: (state) => {
            state.currentPageIndex = 0
            initialView(state)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },
        JUMP_TO_LAST_PAGE: (state) => {
            state.currentPageIndex = state.pageRank.length - 1
            initialView(state)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },
        JUMP_PAGE_WITH_INDEX: (state, action) => {
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
            resetView(state as BoardState)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },
        CENTER_VIEW: (state) => {
            centerView(state as BoardState)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },
        SET_STAGE_ATTRS: (state, action: PayloadAction<StageAttrs>) => {
            assign(
                state.stage.attrs,
                pick(action.payload, keys(state.stage.attrs))
            )
        },
        ON_WINDOW_RESIZE: (state) => {
            state.stage.attrs.width = window.innerWidth
            state.stage.attrs.height = window.innerHeight
            centerView(state as BoardState)
            state.stage.renderTrigger = !state.stage.renderTrigger
        },
        FIT_WIDTH_TO_PAGE: (state) => {
            fitToPage(state as BoardState)
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
    UPDATE_DELETE_STROKES,
    UPDATE_STROKES,
    SET_PDF,
    UNDO_ACTION,
    REDO_ACTION,
    CLEAR_DOCS,
    CLEAR_TRANSFORM,
    SET_PAGE_BACKGROUND,
    SET_PAGE_SIZE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_LAST_PAGE,
    JUMP_PAGE_WITH_INDEX,
    TOGGLE_SHOULD_CENTER,
    TOGGLE_HIDE_NAVBAR,
    CENTER_VIEW,
    RESET_VIEW,
    ON_WINDOW_RESIZE,
    SET_STAGE_ATTRS,
    FIT_WIDTH_TO_PAGE,
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
    TRIGGER_BOARD_RERENDER,
} = boardSlice.actions
export default boardSlice.reducer
