import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_STAGE_WIDTH,
    DEFAULT_STAGE_HEIGHT,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    DEFAULT_STAGE_SCALE,
    DEFAULT_CURRENT_PAGE_INDEX,
    CANVAS_WIDTH,
    CANVAS_FULL_HEIGHT,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
    ZOOM_IN_BUTTON_SCALE,
    ZOOM_OUT_BUTTON_SCALE,
} from "../../constants"

// variables for multitouch zoom
let lastCenter = null
let lastDist = 0

const viewControlSlice = createSlice({
    name: "viewControl",
    initialState: {
        stageWidth: DEFAULT_STAGE_WIDTH,
        stageHeight: DEFAULT_STAGE_HEIGHT,
        stageX: DEFAULT_STAGE_X,
        stageY: DEFAULT_STAGE_Y,
        stageScale: DEFAULT_STAGE_SCALE,
        currentPageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    },
    reducers: {
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
                x: (newCenter.x - state.stageX) / state.stageScale.x,
                y: (newCenter.y - state.stageY) / state.stageScale.x,
            }

            // OPTION 1:
            const scale = state.stageScale.x * (dist / lastDist)
            state.stageScale = { x: scale, y: scale }

            // calculate new position of the stage
            const dx = newCenter.x - lastCenter.x
            const dy = newCenter.y - lastCenter.y

            state.stageX = newCenter.x - pointTo.x * scale + dx
            state.stageY = newCenter.y - pointTo.y * scale + dy

            // OPTION 2
            // zoomToPointWithScale(state, pointTo, dist / lastDist)

            // update info
            lastDist = dist
            lastCenter = newCenter
        },
        MULTI_TOUCH_END: () => {
            lastDist = 0
            lastCenter = null
        },
        RESET_VIEW: (state) => {
            const oldScale = state.stageScale.y
            const newScale = 1
            state.stageScale = { x: newScale, y: newScale }
            state.stageX = 0
            state.stageY =
                state.stageHeight / 2 -
                ((state.stageHeight / 2 - state.stageY) / oldScale) * newScale
            centerView(state)
        },
        CENTER_VIEW: (state) => {
            centerView(state)
        },
        SET_STAGE_X: (state, action) => {
            state.stageX = action.payload
        },
        SET_STAGE_Y: (state, action) => {
            state.stageY = action.payload
            updateCurrentPageIndex(state)
        },
        SCROLL_STAGE_Y: (state, action) => {
            state.stageY -= action.payload
            updateCurrentPageIndex(state)
        },
        SET_STAGE_SCALE: (state, action) => {
            state.stageScale = action.payload
        },
        ON_WINDOW_RESIZE: (state) => {
            state.stageWidth = window.innerWidth
            state.stageHeight = window.innerHeight
            centerView(state)
        },
        FIT_WIDTH_TO_PAGE: (state) => {
            fitToPage(state)
        },
        ZOOM_TO: (state, action) => {
            const { zoomPoint, zoomScale } = action.payload
            zoomToPointWithScale(state, zoomPoint, zoomScale)
        },
        ZOOM_IN_CENTER: (state) => {
            const centerOfScreen = {
                x: state.stageWidth / 2,
                y: state.stageHeight / 2,
            }
            zoomToPointWithScale(state, centerOfScreen, ZOOM_IN_BUTTON_SCALE)
        },
        ZOOM_OUT_CENTER: (state) => {
            const centerOfScreen = {
                x: state.stageWidth / 2,
                y: state.stageHeight / 2,
            }
            zoomToPointWithScale(state, centerOfScreen, ZOOM_OUT_BUTTON_SCALE)
        },
        JUMP_TO_NEXT_PAGE: (state) => {
            goToPage(state, state.currentPageIndex + 1)
        },
        JUMP_TO_PREV_PAGE: (state) => {
            goToPage(state, state.currentPageIndex - 1)
        },
        JUMP_TO_FIRST_PAGE: (state) => {
            goToPage(state, 0)
        },
        JUMP_PAGE_WITH_INDEX: (state, action) => {
            goToPage(state, action.payload)
        },
    },
})

export const {
    MULTI_TOUCH_MOVE,
    MULTI_TOUCH_END,
    CENTER_VIEW,
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
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_FIRST_PAGE,
    JUMP_PAGE_WITH_INDEX,
} = viewControlSlice.actions
export default viewControlSlice.reducer

function goToPage(state, pageIndex) {
    state.currentPageIndex = pageIndex
    state.stageY = -pageIndex * CANVAS_FULL_HEIGHT * state.stageScale.x
    centerView(state)
}

function centerView(state) {
    const x = (window.innerWidth - CANVAS_WIDTH * state.stageScale.x) / 2
    if (x >= 0) {
        state.stageX = x
    } else {
        fitToPage(state)
    }
}

function fitToPage(state) {
    const oldScale = state.stageScale.y
    const newScale = window.innerWidth / CANVAS_WIDTH
    state.stageScale = { x: newScale, y: newScale }
    state.stageX = 0
    state.stageY =
        state.stageHeight / 2 -
        ((state.stageHeight / 2 - state.stageY) / oldScale) * newScale
}

function zoomToPointWithScale(state, zoomPoint, zoomScale) {
    const oldScale = state.stageScale.x
    const mousePointTo = {
        x: (zoomPoint.x - state.stageX) / oldScale,
        y: (zoomPoint.y - state.stageY) / oldScale,
    }
    let newScale = oldScale * zoomScale
    if (newScale > ZOOM_SCALE_MAX) {
        newScale = ZOOM_SCALE_MAX
    } else if (newScale < ZOOM_SCALE_MIN) {
        newScale = ZOOM_SCALE_MIN
    }

    state.stageScale = { x: newScale, y: newScale }

    // if zoomed out then center, else zoom to mouse coords
    const x = (window.innerWidth - CANVAS_WIDTH * newScale) / 2
    if (x >= 0) {
        state.stageX = x
    } else {
        state.stageX = zoomPoint.x - mousePointTo.x * newScale
    }

    state.stageY = zoomPoint.y - mousePointTo.y * newScale
    updateCurrentPageIndex(state) // check if pageId changed by zooming
}

function updateCurrentPageIndex(state) {
    const canvasY = (state.stageHeight / 2 - state.stageY) / state.stageScale.y
    state.currentPageIndex = Math.floor(canvasY / CANVAS_FULL_HEIGHT)
}

/**
 * Helper function for calculating the distance between 2 touch points
 * @param {*} p1
 * @param {*} p2
 */
function getDistance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

/**
 * Helper function for calculating the center between 2 touch points
 * @param {*} p1
 * @param {*} p2
 */
function getCenter(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    }
}
