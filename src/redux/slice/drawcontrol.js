import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_ACTIVE,
    DEFAULT_TOOL,
    DEFAULT_COLOR,
    DEFAULT_WIDTH,
    CANVAS_PIXEL_RATIO,
} from "../../constants.js"

const drawControlSlice = createSlice({
    name: "drawControl",
    initialState: {
        active: DEFAULT_ACTIVE,
        isMouseDown: false,
        liveStroke: {
            type: DEFAULT_TOOL,
            style: {
                color: DEFAULT_COLOR,
                width: DEFAULT_WIDTH * CANVAS_PIXEL_RATIO,
            },
            page_id: "",
            points: {}, // {"pageid": [x1,y1,x2,y2,...]}
        },
    },
    reducers: {
        setColor: (state, action) => {
            const color = action.payload
            state.liveStroke.style.color = color
        },
        setWidth: (state, action) => {
            const width = action.payload
            state.liveStroke.style.width = width
        },
        setType: (state, action) => {
            const type = action.payload
            state.liveStroke.type = type
        },
        setActive: (state, action) => {
            const active = action.payload
            state.active = active
        },
        setIsMouseDown: (state, action) => {
            const isMouseDown = action.payload
            state.isMouseDown = isMouseDown
        },
        actStartLiveStroke: (state, action) => {
            const { page_id, points } = action.payload
            state.liveStroke.page_id = page_id
            state.liveStroke.points[page_id] = points
        },
        // Update the current live stroke position
        actUpdateLiveStrokePos: (state, action) => {
            const points = action.payload
            const pid = state.liveStroke.page_id
            state.liveStroke.points[pid] = [
                ...state.liveStroke.points[pid],
                ...points,
            ]
        },
        actEndLiveStroke: (state) => {
            state.liveStroke.page_id = ""
            state.liveStroke.points = {}
        },
    },
})

export const {
    setColor,
    setWidth,
    setType,
    setActive,
    setIsMouseDown,
    actStartLiveStroke,
    actUpdateLiveStrokePos,
    actEndLiveStroke,
} = drawControlSlice.actions
export default drawControlSlice.reducer
