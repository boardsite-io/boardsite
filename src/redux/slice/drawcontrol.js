import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_ACTIVE,
    DEFAULT_TOOL,
    DEFAULT_COLOR,
    DEFAULT_WIDTH,
    CANVAS_PIXEL_RATIO,
} from "../../constants"

const drawControlSlice = createSlice({
    name: "drawControl",
    initialState: {
        isActive: DEFAULT_ACTIVE,
        isMouseDown: false,
        isDraggable: false,
        liveStroke: {
            type: DEFAULT_TOOL,
            style: {
                color: DEFAULT_COLOR,
                width: DEFAULT_WIDTH * CANVAS_PIXEL_RATIO,
            },
            pageId: "",
            points: {}, // {"pageid": [x1,y1,x2,y2,...]}
            x: 0, // be consistent with stroke description
            y: 0,
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
            state.liveStroke.type = action.payload
        },
        setIsActive: (state, action) => {
            const isActive = action.payload
            state.isActive = isActive
        },
        setIsMouseDown: (state, action) => {
            const isMouseDown = action.payload
            state.isMouseDown = isMouseDown
        },
        setIsDraggable: (state, action) => {
            const isDraggable = action.payload
            state.isDraggable = isDraggable
        },
        actStartLiveStroke: (state, action) => {
            const { pageId, points } = action.payload
            state.liveStroke.pageId = pageId
            state.liveStroke.points[pageId] = points
        },
        // Update the current live stroke position
        actUpdateLiveStrokePos: (state, action) => {
            const points = action.payload
            const { pageId } = state.liveStroke
            state.liveStroke.points[pageId] = [
                ...state.liveStroke.points[pageId],
                ...points,
            ]
        },
        actEndLiveStroke: (state) => {
            state.liveStroke.pageId = ""
            state.liveStroke.points = {}
        },
    },
})

export const {
    setColor,
    setWidth,
    setType,
    setIsActive,
    setIsMouseDown,
    setIsDraggable,
    actStartLiveStroke,
    actUpdateLiveStrokePos,
    actEndLiveStroke,
} = drawControlSlice.actions
export default drawControlSlice.reducer
