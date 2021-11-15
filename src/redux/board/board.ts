import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { pick, keys, assign } from "lodash"
import { Point, Stroke, StrokeMap } from "drawing/stroke/types"
import {
    DEFAULT_STAGE_Y,
    ZOOM_IN_BUTTON_SCALE,
    ZOOM_OUT_BUTTON_SCALE,
} from "consts"
import { Page } from "types"
import {
    addAction,
    addStrokes,
    deleteStrokes,
    redoAction,
    undoAction,
    updateOrAddStrokes,
} from "./undoredo"
import {
    centerView,
    detectPageChange,
    fitToPage,
    multiTouchEnd,
    multiTouchMove,
    zoomToPointWithScale,
} from "./helpers"
import { BoardState, newState } from "./state"

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
        },

        SET_PAGERANK: (state, action) => {
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection
        },

        SET_PAGEMETA: (state, action) => {
            const { pageId, meta } = action.payload
            state.pageCollection[pageId]?.updateMeta(meta)
        },

        SET_PAGE_BACKGROUND: (state, action) => {
            const style = action.payload
            state.pageSettings.background = style
        },

        SET_PAGE_SIZE: (state, action) => {
            state.pageSettings.size = action.payload
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
        },

        CLEAR_PAGE: (state, action) => {
            const pageId = action.payload
            state.pageCollection[pageId]?.clear()
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
            })
        },

        // removes all pages but leaves the document
        DELETE_ALL_PAGES: (state) => {
            state.pageRank = []
            state.pageCollection = {}
        },

        CLEAR_DOCS: (state) => {
            state.documentImages = []
            state.documentSrc = ""
        },

        CLEAR_TRANSFORM: (state) => {
            state.transformStrokes = []
        },

        MOVE_SHAPES_TO_DRAG_LAYER: (
            state,
            action: PayloadAction<{
                selectedStrokes: StrokeMap
                pagePosition: Point
            }>
        ) => {
            const { selectedStrokes, pagePosition } = action.payload
            state.transformPagePosition = pagePosition
            state.transformStrokes = Object.values(selectedStrokes).map(
                (stroke) => stroke.serialize() // copy
            )
        },

        // Add strokes to collection
        ADD_STROKES: (state, action) => {
            const { strokes, isRedoable, sessionHandler, sessionUndoHandler } =
                action.payload

            strokes.sort((a: Stroke, b: Stroke) => a.id > b.id)

            const handler = (boardState: BoardState) => {
                addStrokes(boardState, ...strokes)
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
            // manual update
            state.triggerUpdate = (state.triggerUpdate ?? 0) + 1
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
                addStrokes(boardState, ...strokes)
                sessionUndoHandler?.()
            }
            addAction(
                handler,
                undoHandler,
                state as BoardState,
                state.undoStack,
                isRedoable
            )
            // manual update
            state.triggerUpdate = (state.triggerUpdate ?? 0) + 1
        },

        // Update stroke position after dragging
        UPDATE_STROKES(state, action) {
            const {
                strokes,
                updates,
                isRedoable,
                sessionHandler,
                sessionUndoHandler,
            } = action.payload

            const handler = (boardState: BoardState) => {
                updateOrAddStrokes(boardState, ...updates)
                sessionHandler?.()
            }
            const undoHandler = (boardState: BoardState) => {
                updateOrAddStrokes(boardState, ...strokes)
                sessionUndoHandler?.()
            }
            addAction(
                handler,
                undoHandler,
                state as BoardState,
                state.undoStack,
                isRedoable
            )
            // manual update
            state.triggerUpdate = (state.triggerUpdate ?? 0) + 1
        },

        SET_PDF: (state, action) => {
            const { documentImages, documentSrc } = action.payload
            state.documentImages = documentImages
            state.documentSrc = documentSrc
        },

        UNDO_ACTION: (state) => {
            undoAction(state as BoardState)
            // manual update
            state.triggerUpdate = (state.triggerUpdate ?? 0) + 1
        },

        REDO_ACTION: (state) => {
            redoAction(state as BoardState)
            // manual update
            state.triggerUpdate = (state.triggerUpdate ?? 0) + 1
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
        JUMP_PAGE_WITH_INDEX: (state, action) => {
            const targetIndex = action.payload
            if (targetIndex <= state.pageRank.length - 1 && targetIndex >= 0) {
                state.currentPageIndex = targetIndex
            }
        },

        TOGGLE_SHOULD_CENTER: (state) => {
            state.view.keepCentered = !state.view.keepCentered
        },
        TOGGLE_HIDE_NAVBAR: (state) => {
            state.view.hideNavBar = !state.view.hideNavBar
        },
        MULTI_TOUCH_MOVE: (state, action) => {
            const { p1, p2 } = action.payload
            multiTouchMove(state.view, p1, p2)
        },
        MULTI_TOUCH_END: (state) => {
            detectPageChange(state as unknown as BoardState)
            multiTouchEnd()
        },
        // use this e.g., on page change
        INITIAL_VIEW: (state) => {
            state.view.stageScale = { x: 1, y: 1 }
            state.view.stageX = 0
            state.view.stageY = DEFAULT_STAGE_Y
            centerView(state as BoardState)
        },
        RESET_VIEW: (state) => {
            const oldScale = state.view.stageScale.y
            const newScale = 1
            state.view.stageScale = { x: newScale, y: newScale }
            state.view.stageX = 0
            state.view.stageY =
                state.view.stageHeight / 2 -
                ((state.view.stageHeight / 2 - state.view.stageY) / oldScale) *
                    newScale
            centerView(state as BoardState)
        },
        CENTER_VIEW: (state) => {
            centerView(state as BoardState)
        },
        SET_STAGE_X: (state, action) => {
            state.view.stageX = action.payload
        },
        SET_STAGE_Y: (state, action) => {
            state.view.stageY = action.payload
            detectPageChange(state as unknown as BoardState)
        },
        SCROLL_STAGE_Y: (state, action) => {
            state.view.stageY -= action.payload
            detectPageChange(state as unknown as BoardState)
        },
        SET_STAGE_SCALE: (state, action) => {
            state.view.stageScale = action.payload
        },
        ON_WINDOW_RESIZE: (state) => {
            state.view.stageWidth = window.innerWidth
            state.view.stageHeight = window.innerHeight
            centerView(state as BoardState)
        },
        FIT_WIDTH_TO_PAGE: (state) => {
            fitToPage(state as BoardState)
        },
        ZOOM_TO: (state, action) => {
            const { zoomPoint, zoomScale } = action.payload
            zoomToPointWithScale(state as BoardState, zoomPoint, zoomScale)
        },
        ZOOM_IN_CENTER: (state) => {
            const centerOfScreen = {
                x: state.view.stageWidth / 2,
                y: state.view.stageHeight / 2,
            }
            zoomToPointWithScale(
                state as BoardState,
                centerOfScreen,
                ZOOM_IN_BUTTON_SCALE
            )
        },
        ZOOM_OUT_CENTER: (state) => {
            const centerOfScreen = {
                x: state.view.stageWidth / 2,
                y: state.view.stageHeight / 2,
            }
            zoomToPointWithScale(
                state as BoardState,
                centerOfScreen,
                ZOOM_OUT_BUTTON_SCALE
            )
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
    MULTI_TOUCH_MOVE,
    MULTI_TOUCH_END,
    CENTER_VIEW,
    INITIAL_VIEW,
    RESET_VIEW,
    SET_STAGE_X,
    SET_STAGE_Y,
    SCROLL_STAGE_Y,
    SET_STAGE_SCALE,
    ON_WINDOW_RESIZE,
    FIT_WIDTH_TO_PAGE,
    ZOOM_TO,
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
} = boardSlice.actions
export default boardSlice.reducer
