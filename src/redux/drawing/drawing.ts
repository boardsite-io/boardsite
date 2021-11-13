import { StrokeMap, Tool, ToolType } from "drawing/stroke/types"
import { createSlice } from "@reduxjs/toolkit"
import { newState } from "./state"

const drawingSlice = createSlice({
    name: "drawing",
    initialState: newState(),
    reducers: {
        REPLACE_FAV_TOOL: (state, action) => {
            const index = action.payload as number
            const tool: Tool = {
                type: state.liveStroke.type,
                style: { ...state.liveStroke.style },
            }

            // validate tool candidate
            if (
                tool.type !== ToolType.Eraser &&
                tool.type !== ToolType.Select
            ) {
                state.favTools[index] = tool
            }
        },
        REMOVE_FAV_TOOL: (state, action) => {
            const index = action.payload
            state.favTools.splice(index, 1)
        },
        ADD_FAV_TOOL: (state) => {
            const tool: Tool = {
                type: state.liveStroke.type,
                style: { ...state.liveStroke.style },
            }

            // validate tool candidate
            if (
                tool.type !== ToolType.Eraser &&
                tool.type !== ToolType.Select
            ) {
                state.favTools.push(tool)
            }
        },
        SET_TOOL: (state, action) => {
            const { type, style } = action.payload
            if (type !== undefined) {
                state.liveStroke.type = type
                state.isDraggable = type === ToolType.Select
            }
            if (style !== undefined) {
                state.liveStroke.style = { ...style }
            }
        },
        SET_COLOR: (state, action) => {
            const color = action.payload
            state.liveStroke.style.color = color
        },
        SET_WIDTH: (state, action) => {
            const width = action.payload
            state.liveStroke.style.width = width
        },
        SET_ISMOUSEDOWN: (state, action) => {
            const isMouseDown = action.payload
            state.isMouseDown = isMouseDown
        },
        // Update the current live stroke position
        UPDATE_LIVESTROKE: (state) => {
            state.liveStrokeUpdate += 1
        },
        END_LIVESTROKE: (state) => {
            state.liveStrokeUpdate = 0
            state.erasedStrokes = {}
        },
        TOGGLE_DIRECTDRAW: (state) => {
            state.directDraw = !state.directDraw
        },
        SET_ERASED_STROKES: (state, action) => {
            const strokes: StrokeMap = action.payload
            Object.keys(strokes).forEach((id) => {
                state.erasedStrokes[id] = strokes[id]
            })
        },
    },
})

export const {
    REPLACE_FAV_TOOL,
    REMOVE_FAV_TOOL,
    ADD_FAV_TOOL,
    SET_TOOL,
    SET_COLOR,
    SET_WIDTH,
    SET_ISMOUSEDOWN,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    TOGGLE_DIRECTDRAW,
    SET_ERASED_STROKES,
} = drawingSlice.actions
export default drawingSlice.reducer
