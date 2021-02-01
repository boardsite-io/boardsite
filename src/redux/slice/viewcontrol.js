import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_STAGE_WIDTH,
    DEFAULT_STAGE_HEIGHT,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    DEFAULT_STAGE_SCALE,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    CANVAS_GAP,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
    ZOOM_IN_SCALE,
    ZOOM_OUT_SCALE,
} from "../../constants"

function centerView(state) {
    const x = (window.innerWidth - CANVAS_WIDTH * state.stageScale.x) / 2
    if (x >= 0) {
        state.stageX = x
    } else {
        fitToPage()
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
    state.stageX = zoomPoint.x - mousePointTo.x * newScale
    state.stageY = zoomPoint.y - mousePointTo.y * newScale
}

const drawControlSlice = createSlice({
    name: "drawControl",
    initialState: {
        stageWidth: DEFAULT_STAGE_WIDTH,
        stageHeight: DEFAULT_STAGE_HEIGHT,
        stageX: DEFAULT_STAGE_X,
        stageY: DEFAULT_STAGE_Y,
        stageScale: DEFAULT_STAGE_SCALE,
        currentActivePageId: 0,
    },
    reducers: {
        SET_STAGE_X: (state, action) => {
            state.stageX = action.payload
        },
        SET_STAGE_Y: (state, action) => {
            state.stageY = action.payload
            const canvasY =
                (state.stageHeight / 2 - state.stageY) / state.stageScale.y
            state.currentActivePageId = Math.floor(
                canvasY / (CANVAS_HEIGHT + CANVAS_GAP)
            )
        },
        SET_STAGE_SCALE: (state, action) => {
            state.stageScale = action.payload
        },
        ON_WINDOW_RESIZE: (state) => {
            state.stageWidth = window.innerWidth
            state.stageHeight = window.innerHeight
            centerView(state)
        },
        CENTER_VIEW: (state) => {
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
            zoomToPointWithScale(state, centerOfScreen, ZOOM_IN_SCALE)
        },
        ZOOM_OUT_CENTER: (state) => {
            const centerOfScreen = {
                x: state.stageWidth / 2,
                y: state.stageHeight / 2,
            }
            zoomToPointWithScale(state, centerOfScreen, ZOOM_OUT_SCALE)
        },
    },
})

export const {
    SET_STAGE_X,
    SET_STAGE_Y,
    SET_STAGE_SCALE,
    ON_WINDOW_RESIZE,
    CENTER_VIEW,
    FIT_WIDTH_TO_PAGE,
    ZOOM_TO,
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
} = drawControlSlice.actions
export default drawControlSlice.reducer
