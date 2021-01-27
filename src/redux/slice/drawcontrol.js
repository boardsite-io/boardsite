import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_ACTIVE,
    DEFAULT_TOOL,
    DEFAULT_COLOR,
    DEFAULT_WIDTH,
    CANVAS_PIXEL_RATIO,
    toolType,
    WIDTH_MAX,
    WIDTH_MIN,
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
        },
        SET_ISACTIVE: (state, action) => {
            const isActive = action.payload
            state.isActive = isActive
        },
        SET_ISMOUSEDOWN: (state, action) => {
            const isMouseDown = action.payload
            state.isMouseDown = isMouseDown
        },
        START_LIVESTROKE: (state, action) => {
            const { pageId, points } = action.payload
            state.liveStroke.pageId = pageId
            state.liveStroke.points[pageId] = points
        },
        // Update the current live stroke position
        UPDATE_LIVESTROKE: (state, action) => {
            const points = action.payload
            const { pageId } = state.liveStroke
            state.liveStroke.points[pageId] = [
                ...state.liveStroke.points[pageId],
                ...points,
            ]
        },
        END_LIVESTROKE: (state) => {
            state.liveStroke.pageId = ""
            state.liveStroke.points = {}
        },
    },
})

export const {
    SET_COLOR,
    SET_WIDTH,
    INCREMENT_WIDTH,
    DECREMENT_WIDTH,
    SET_TYPE,
    SET_ISACTIVE,
    SET_ISMOUSEDOWN,
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
} = drawControlSlice.actions
export default drawControlSlice.reducer
