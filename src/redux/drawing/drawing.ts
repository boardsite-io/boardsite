import { StrokeMap, Tool, ToolType } from "drawing/stroke/stroke.types"
import { createSlice } from "@reduxjs/toolkit"
import { newState } from "./state"

const drawingSlice = createSlice({
    name: "drawing",
    initialState: newState(),
    reducers: {
        REPLACE_FAV_TOOL: (state, action) => {
            const index = action.payload as number
            const tool: Tool = {
                type: state.tool.type,
                style: { ...state.tool.style },
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
                type: state.tool.type,
                style: { ...state.tool.style },
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
                state.tool.type = type
                state.isDraggable = type === ToolType.Select
            }
            if (style !== undefined) {
                state.tool.style = { ...style }
            }
        },
        SET_COLOR: (state, action) => {
            const color = action.payload
            state.tool.style.color = color
        },
        SET_WIDTH: (state, action) => {
            const width = action.payload
            state.tool.style.width = width
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
        CLEAR_ERASED_STROKES: (state) => {
            state.erasedStrokes = {}
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
    TOGGLE_DIRECTDRAW,
    SET_ERASED_STROKES,
    CLEAR_ERASED_STROKES,
} = drawingSlice.actions
export default drawingSlice.reducer
