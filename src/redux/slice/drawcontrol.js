import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_ACTIVE,
    DEFAULT_TOOL,
    DEFAULT_COLOR,
    DEFAULT_WIDTH,
    CANVAS_PIXEL_RATIO,
    type,
} from "../../constants.js"

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
            const { page_id, points } = action.payload
            state.liveStroke.x = 0 // offset to update later when dragged
            state.liveStroke.y = 0
            state.liveStroke.page_id = page_id
            state.liveStroke.points[page_id] = points
        },
        // Update the current live stroke position
        actUpdateLiveStrokePos: (state, action) => {
            const points = action.payload
            const pid = state.liveStroke.page_id
            const currentType = state.liveStroke.type
            switch (currentType) {
                case type.PEN:
                    state.liveStroke.points[pid] = [
                        ...state.liveStroke.points[pid],
                        ...points,
                    ]
                    break;
                case type.LINE:
                    state.liveStroke.points[pid][2] = points[0]
                    state.liveStroke.points[pid][3] = points[1]
                    break
                // case type.TRIANGLE:
                //     state.liveStroke.points[pid][2] = points[0]
                //     state.liveStroke.points[pid][3] = points[1]
                //     break
                case type.CIRCLE:
                    state.liveStroke.x = state.liveStroke.points[pid][0]
                    state.liveStroke.y = state.liveStroke.points[pid][1]
                    const dx = points[0] - state.liveStroke.points[pid][0]
                    const dy = points[1] - state.liveStroke.points[pid][1]
                    const radius = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
                    state.liveStroke.radius = radius
                    break
                default:
                    break;
            }
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
    setIsActive,
    setIsMouseDown,
    setIsDraggable,
    actStartLiveStroke,
    actUpdateLiveStrokePos,
    actEndLiveStroke,
} = drawControlSlice.actions
export default drawControlSlice.reducer
