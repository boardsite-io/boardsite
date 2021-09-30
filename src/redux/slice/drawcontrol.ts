import { StrokeMap, Tool, ToolType } from "drawing/stroke/types"
import { createSlice } from "@reduxjs/toolkit"
import { BoardLiveStroke } from "../../drawing/stroke/livestroke"
import { TrNodesType } from "../../types"
import {
    DEFAULT_ISDRAGGABLE,
    DEFAULT_ISMOUSEDOWN,
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
} from "../../constants"

export interface DrawControlState {
    isDraggable: boolean
    isMouseDown: boolean
    directDraw: boolean
    liveStroke: BoardLiveStroke
    liveStrokeUpdate: number
    favTools: Tool[]
    trNodes: TrNodesType
    erasedStrokes: StrokeMap
}

const initState: DrawControlState = {
    isDraggable: DEFAULT_ISDRAGGABLE,
    isMouseDown: DEFAULT_ISMOUSEDOWN,
    directDraw: DEFAULT_DIRECTDRAW,
    liveStroke: new BoardLiveStroke(),
    liveStrokeUpdate: 0,
    favTools: DEFAULT_FAV_TOOLS,
    trNodes: [],
    erasedStrokes: {},
}

const drawControlSlice = createSlice({
    name: "drawControl",
    initialState: initState,
    reducers: {
        SET_TR_NODES: (state, action) => {
            state.trNodes = action.payload
        },
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
            state.liveStroke.style = { ...style }
            state.liveStroke.type = type
            state.isDraggable = type === ToolType.Select
            state.trNodes = []
        },
        SET_COLOR: (state, action) => {
            const color = action.payload
            state.liveStroke.style.color = color
        },
        SET_WIDTH: (state, action) => {
            const width = action.payload
            state.liveStroke.style.width = width
        },
        SET_TYPE: (state, action) => {
            const type = action.payload
            state.liveStroke.type = type
            state.isDraggable = type === ToolType.Select
            state.trNodes = []
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
    SET_TYPE,
    SET_ISMOUSEDOWN,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    TOGGLE_DIRECTDRAW,
    SET_TR_NODES,
    SET_ERASED_STROKES,
} = drawControlSlice.actions
export default drawControlSlice.reducer
