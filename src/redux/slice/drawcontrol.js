import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_ISPANMODE,
    DEFAULT_TOOL,
    DEFAULT_COLOR,
    DEFAULT_WIDTH,
    CANVAS_PIXEL_RATIO,
    toolType,
    WIDTH_MAX,
    WIDTH_MIN,
    MAX_LIVESTROKE_PTS,
} from "../../constants"

const drawControlSlice = createSlice({
    name: "drawControl",
    initialState: {
        isPanMode: DEFAULT_ISPANMODE,
        isDraggable: false,
        isListening: false,
        isMouseDown: false,
        currPageIndex: 0,
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
    },
    reducers: {
        SET_CURR_PAGE_IDX: (state, action) => {
            state.currPageIndex = action.payload
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
            const points = action.payload
            state.liveStroke.points = [points]
        },
        // Update the current live stroke position
        UPDATE_LIVESTROKE: (state, action) => {
            const points = action.payload
            const p =
                state.liveStroke.points[state.liveStroke.points.length - 1]
            if (p.length < MAX_LIVESTROKE_PTS) {
                p.push(...points)
            } else {
                // create a new subarray
                // with the last point from the previous subarray as entry
                // in order to not get a gap in the stroke
                state.liveStroke.points.push(
                    p.slice(p.length - 2, p.length).concat(points)
                )
            }
        },
        END_LIVESTROKE: (state) => {
            state.liveStroke.points = []
        },
    },
})

export const {
    SET_CURR_PAGE_IDX,
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
} = drawControlSlice.actions
export default drawControlSlice.reducer
