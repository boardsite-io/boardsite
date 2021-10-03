import { createSlice } from "@reduxjs/toolkit"
import { Point, Stroke } from "drawing/stroke/types"
import {
    DEFAULT_CURRENT_PAGE_INDEX,
    DEFAULT_PAGE_HEIGHT,
    DEFAULT_PAGE_WIDTH,
    pageType,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    DEFAULT_STAGE_SCALE,
    ZOOM_IN_BUTTON_SCALE,
    ZOOM_OUT_BUTTON_SCALE,
    DEFAULT_KEEP_CENTERED,
    DEFAULT_HIDE_NAVBAR,
} from "../../constants"
import { Page } from "../../types"
import {
    centerView,
    detectPageChange,
    fitToPage,
    getCenter,
    getDistance,
    zoomToPointWithScale,
} from "./helpers"
import { BoardState } from "./types"

// variables for multitouch zoom
let lastCenter: Point | null = null
let lastDist = 0

export const initState: BoardState = {
    currentPageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    pageRank: [],
    pageCollection: {},
    document: [],
    documentSrc: "",
    pageSettings: {
        background: pageType.BLANK, // default,
        width: DEFAULT_PAGE_WIDTH,
        height: DEFAULT_PAGE_HEIGHT,
    },
    view: {
        keepCentered: DEFAULT_KEEP_CENTERED,
        hideNavBar: DEFAULT_HIDE_NAVBAR,
        stageWidth: window.innerWidth,
        stageHeight: window.innerHeight,
        stageX: DEFAULT_STAGE_X,
        stageY: DEFAULT_STAGE_Y,
        stageScale: DEFAULT_STAGE_SCALE,
    },
}

const boardSlice = createSlice({
    name: "board",
    initialState: initState,
    reducers: {
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

        SET_PAGE_WIDTH: (state, action: { payload: number }) => {
            state.pageSettings.width = action.payload
        },

        SET_PAGE_HEIGHT: (state, action: { payload: number }) => {
            state.pageSettings.height = action.payload
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

        DELETE_PAGE: (state, action) => {
            const pageId = action.payload
            delete state.pageCollection[pageId]
            state.pageRank.splice(state.pageRank.indexOf(pageId), 1)
        },

        DELETE_ALL_PAGES: (state) => {
            state.pageRank = []
            state.pageCollection = {}
        },

        // Add strokes to collection
        ADD_STROKES: (state, action) => {
            const strokes = action.payload
            strokes.sort((a: Stroke, b: Stroke) => a.id > b.id)
            strokes.forEach((s: Stroke) => {
                const page = state.pageCollection[s.pageId]
                if (page) {
                    page.strokes[s.id] = s
                }
            })
        },

        // Erase strokes from collection
        ERASE_STROKES(state, action) {
            const strokes: Stroke[] = action.payload
            strokes.forEach(({ id, pageId }) => {
                const page = state.pageCollection[pageId]
                if (page) {
                    delete page.strokes[id]
                }
            })
        },

        // Update stroke position after dragging
        UPDATE_STROKES(state, action) {
            const strokes: Stroke[] = action.payload
            strokes.forEach(({ id, pageId, x, y, scaleX, scaleY }) => {
                const stroke = state.pageCollection[pageId]?.strokes[
                    id
                ] as Stroke
                stroke.update({ x, y }, { x: scaleX, y: scaleY })
            })
        },

        SET_PDF: (state, action) => {
            const { pageImages, documentSrc } = action.payload
            state.document = pageImages
            state.documentSrc = documentSrc
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
            if (!lastCenter) {
                lastCenter = getCenter(p1, p2)
                return
            }
            const newCenter = getCenter(p1, p2)
            const dist = getDistance(p1, p2)

            if (!lastDist) {
                lastDist = dist
            }

            // local coordinates of center point
            const pointTo = {
                x: (newCenter.x - state.view.stageX) / state.view.stageScale.x,
                y: (newCenter.y - state.view.stageY) / state.view.stageScale.x,
            }

            // OPTION 1:
            const scale = state.view.stageScale.x * (dist / lastDist)
            state.view.stageScale = { x: scale, y: scale }

            // calculate new position of the stage
            const dx = newCenter.x - lastCenter.x
            const dy = newCenter.y - lastCenter.y

            state.view.stageX = newCenter.x - pointTo.x * scale + dx
            state.view.stageY = newCenter.y - pointTo.y * scale + dy

            // OPTION 2
            // zoomToPointWithScale(state, pointTo, dist / lastDist)

            // update info
            lastDist = dist
            lastCenter = newCenter
        },
        MULTI_TOUCH_END: (state) => {
            lastDist = 0
            lastCenter = null
            detectPageChange(state as BoardState)
        },
        // use this e.g., on page change
        INITIAL_VIEW: (state) => {
            state.view.stageScale = { x: 1, y: 1 }
            state.view.stageX = 0
            state.view.stageY = DEFAULT_STAGE_Y
            centerView(state.view)
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
            centerView(state.view)
        },
        CENTER_VIEW: (state) => {
            centerView(state.view)
        },
        SET_STAGE_X: (state, action) => {
            state.view.stageX = action.payload
        },
        SET_STAGE_Y: (state, action) => {
            state.view.stageY = action.payload
            detectPageChange(state as BoardState)
        },
        SCROLL_STAGE_Y: (state, action) => {
            state.view.stageY -= action.payload
            detectPageChange(state as BoardState)
        },
        SET_STAGE_SCALE: (state, action) => {
            state.view.stageScale = action.payload
        },
        ON_WINDOW_RESIZE: (state) => {
            state.view.stageWidth = window.innerWidth
            state.view.stageHeight = window.innerHeight
            centerView(state.view)
        },
        FIT_WIDTH_TO_PAGE: (state) => {
            fitToPage(state.view)
        },
        ZOOM_TO: (state, action) => {
            const { zoomPoint, zoomScale } = action.payload
            zoomToPointWithScale(state.view, zoomPoint, zoomScale)
        },
        ZOOM_IN_CENTER: (state) => {
            const centerOfScreen = {
                x: state.view.stageWidth / 2,
                y: state.view.stageHeight / 2,
            }
            zoomToPointWithScale(
                state.view,
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
                state.view,
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
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    ADD_STROKES,
    ERASE_STROKES,
    UPDATE_STROKES,
    SET_PDF,
    SET_PAGE_BACKGROUND,
    SET_PAGE_HEIGHT,
    SET_PAGE_WIDTH,
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
