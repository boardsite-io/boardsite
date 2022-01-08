import { StrokeMap, Tool, ToolType } from "drawing/stroke/index.types"
import { createSlice } from "@reduxjs/toolkit"
import { newState } from "./state"
import { isDrawType } from "./helpers"

const drawingSlice = createSlice({
    name: "drawing",
    initialState: newState(),
    reducers: {
        REPLACE_FAVORITE_TOOL: (state, action) => {
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
                state.favoriteTools[index] = tool
            }
        },
        REMOVE_FAVORITE_TOOL: (state, action) => {
            const index = action.payload
            state.favoriteTools.splice(index, 1)
        },
        ADD_FAVORITE_TOOL: (state) => {
            const tool: Tool = {
                type: state.tool.type,
                style: { ...state.tool.style },
            }

            // validate tool candidate
            if (
                tool.type !== ToolType.Eraser &&
                tool.type !== ToolType.Select
            ) {
                state.favoriteTools.push(tool)
            }
        },
        SET_TOOL: (state, action) => {
            const { type, style } = action.payload
            if (type !== undefined) {
                state.tool.type = type
                state.isDraggable = type === ToolType.Select

                // Save latest draw type to enable resuming to that tool
                if (isDrawType(type)) {
                    state.tool.latestDrawType = type
                }
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
    REPLACE_FAVORITE_TOOL,
    REMOVE_FAVORITE_TOOL,
    ADD_FAVORITE_TOOL,
    SET_TOOL,
    SET_COLOR,
    SET_WIDTH,
    TOGGLE_DIRECTDRAW,
    SET_ERASED_STROKES,
    CLEAR_ERASED_STROKES,
} = drawingSlice.actions
export default drawingSlice.reducer
