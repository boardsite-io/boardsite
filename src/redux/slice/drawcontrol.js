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
        liveStroke: {
            type: DEFAULT_TOOL,
            style: {
                color: DEFAULT_COLOR,
                width: DEFAULT_WIDTH * CANVAS_PIXEL_RATIO,
            },
            page_id: "",
            points: [],
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
        setTool: (state, action) => {
            const tool = action.payload
            state.liveStroke.type = tool
        },
        setActive: (state, action) => {
            const active = action.payload
            state.active = active
        },
        actStartLiveStroke: (state, action) => {
            const { page_id, points } = action.payload
            state.liveStroke.page_id = page_id
            state.liveStroke.points = points
        },
        // Set the current live stroke position
        actSetLiveStrokePos: (state, action) => {
            const points = action.payload
            state.liveStroke.points = points
        },
        actEndLiveStroke: (state) => {
            state.liveStroke.page_id = ""
            state.liveStroke.points = []
        },
    },
})

export const {
    setColor,
    setWidth,
    setTool,
    setActive,
    actStartLiveStroke,
    actSetLiveStrokePos,
    actEndLiveStroke,
} = drawControlSlice.actions
export default drawControlSlice.reducer
