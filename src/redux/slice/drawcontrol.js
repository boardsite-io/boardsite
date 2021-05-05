import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_ISPANMODE,
    DEFAULT_TOOL,
    DEFAULT_COLOR,
    DEFAULT_WIDTH,
    DEFAULT_ISDRAGGABLE,
    DEFAULT_ISLISTENING,
    DEFAULT_ISMOUSEDOWN,
    CANVAS_PIXEL_RATIO,
    toolType,
    WIDTH_MAX,
    WIDTH_MIN,
    MAX_LIVESTROKE_PTS,
    MIN_SAMPLE_COUNT,
    LIVESTROKE_PTS_OVERLAP,
    pageType,
    DEFAULT_DIRECTDRAW,
} from "../../constants"

const tool1 = {
    type: DEFAULT_TOOL,
    style: {
        color: DEFAULT_COLOR,
        width: DEFAULT_WIDTH,
    },
}
const tool2 = {
    type: toolType.RECTANGLE,
    style: {
        color: "#188425",
        width: 30,
    },
}
const tool3 = {
    type: toolType.LINE,
    style: {
        color: "#ffee25",
        width: 6,
    },
}

const drawControlSlice = createSlice({
    name: "drawControl",
    initialState: {
        isPanMode: DEFAULT_ISPANMODE,
        isDraggable: DEFAULT_ISDRAGGABLE,
        isListening: DEFAULT_ISLISTENING,
        isMouseDown: DEFAULT_ISMOUSEDOWN,
        directDraw: DEFAULT_DIRECTDRAW,
        samplesRequired: MIN_SAMPLE_COUNT,
        strokeSample: 0,
        liveStroke: {
            type: DEFAULT_TOOL,
            style: {
                color: DEFAULT_COLOR,
                width: DEFAULT_WIDTH * CANVAS_PIXEL_RATIO,
            },
            points: [],
            x: 0, // be consistent with stroke description
            y: 0,
        },
        pageBG: pageType.BLANK,
        favTools: [tool1, tool2, tool3],
    },
    reducers: {
        ADD_FAV_TOOL: (state) => {
            const tool = {
                type: state.liveStroke.type,
                style: state.liveStroke.style,
            }
            state.favTools.push(tool)
        },
        SET_TOOL: (state, action) => {
            const { type, style } = action.payload
            state.liveStroke.type = type
            state.liveStroke.style = style
        },
        SET_COLOR: (state, action) => {
            const color = action.payload
            state.liveStroke.style.color = color
        },
        SET_WIDTH: (state, action) => {
            const width = action.payload
            state.liveStroke.style.width = width
        },
        INCREMENT_WIDTH: (state) => {
            if (state.liveStroke.style.width !== WIDTH_MAX) {
                state.liveStroke.style.width += 1
            }
        },
        DECREMENT_WIDTH: (state) => {
            if (state.liveStroke.style.width !== WIDTH_MIN) {
                state.liveStroke.style.width -= 1
            }
        },
        SET_TYPE: (state, action) => {
            const type = action.payload
            state.liveStroke.type = type
            state.isDraggable = type === toolType.DRAG
            state.isListening =
                type === toolType.DRAG || type === toolType.ERASER
        },
        SET_ISPANMODE: (state, action) => {
            state.isPanMode = action.payload
        },
        TOGGLE_PANMODE: (state) => {
            const { type } = state.liveStroke
            state.isPanMode = !state.isPanMode
            if (state.isPanMode) {
                state.isDraggable = false
                state.isListening = false
            } else {
                state.isDraggable = type === toolType.DRAG
                state.isListening =
                    type === toolType.DRAG || type === toolType.ERASER
            }
        },
        SET_ISMOUSEDOWN: (state, action) => {
            const isMouseDown = action.payload
            state.isMouseDown = isMouseDown
        },
        START_LIVESTROKE: (state, action) => {
            const point = action.payload
            state.liveStroke.points = [point]
        },
        // Update the current live stroke position
        UPDATE_LIVESTROKE: (state, action) => {
            const point = action.payload
            const pLen = state.liveStroke.points.length
            const p = state.liveStroke.points[pLen - 1]

            if (p.length < MAX_LIVESTROKE_PTS) {
                if (state.strokeSample === 0) {
                    // append new point
                    p.push(...point)
                } else {
                    // update the latest point
                    p.splice(p.length - 2, 2, ...point)
                }
            } else {
                // create a new subarray
                // with the last point from the previous subarray as entry
                // in order to not get a gap in the stroke
                state.liveStroke.points.push(
                    p
                        .slice(p.length - LIVESTROKE_PTS_OVERLAP * 2, p.length)
                        .concat(point)
                )
            }

            state.strokeSample += 1
            if (state.strokeSample >= state.samplesRequired) {
                state.strokeSample = 0
            }
        },
        END_LIVESTROKE: (state) => {
            state.liveStroke.points = []
            state.strokeSample = 0
        },
        SET_DEFAULT_PAGEBG: (state, action) => {
            state.pageBG = action.payload
        },
        SET_SAMPLE_COUNT: (state, action) => {
            state.samplesRequired = action.payload
        },
        TOGGLE_DIRECTDRAW: (state) => {
            state.directDraw = !state.directDraw
        },
    },
})

/**
 * calculates the mean x and y of all bufferpoints
 * @param {array} pts buffer points in form [[p1x, p2y], [p2x, p2y], ...]
 */
// function calcSmoothPoint(pts) {
//     const numBufferPoints = pts.length
//     let x = 0
//     let y = 0
//     for (let i = 0; i < numBufferPoints; i += 1) {
//         x += pts[i][0]
//         y += pts[i][1]
//     }
//     const smoothX = x / numBufferPoints
//     const smoothY = y / numBufferPoints

//     return [smoothX, smoothY]
// }

export const {
    ADD_FAV_TOOL,
    SET_TOOL,
    SET_COLOR,
    SET_WIDTH,
    INCREMENT_WIDTH,
    DECREMENT_WIDTH,
    SET_TYPE,
    SET_ISPANMODE,
    TOGGLE_PANMODE,
    SET_ISMOUSEDOWN,
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    SET_DEFAULT_PAGEBG,
    SET_SAMPLE_COUNT,
    TOGGLE_DIRECTDRAW,
} = drawControlSlice.actions
export default drawControlSlice.reducer
