import { createSlice } from "@reduxjs/toolkit"
import {
    DEFAULT_ISPANMODE,
    DEFAULT_ISDRAGGABLE,
    DEFAULT_ISLISTENING,
    DEFAULT_ISMOUSEDOWN,
    WIDTH_MAX,
    WIDTH_MIN,
    MIN_SAMPLE_COUNT,
    pageType,
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
} from "../../constants"
import { BoardLiveStroke } from "../../component/board/stroke/livestroke"
import { PageBackground, Tool, ToolType, TrNodesType } from "../../types"

export interface DrawControlState {
    isPanMode: boolean
    isDraggable: boolean
    isListening: boolean
    isMouseDown: boolean
    directDraw: boolean
    samplesRequired: number
    strokeSample: number
    liveStroke: BoardLiveStroke
    liveStrokeUpdate: number
    pageBG: PageBackground
    favTools: Tool[]
    trNodes: TrNodesType
}

const initState: DrawControlState = {
    isPanMode: DEFAULT_ISPANMODE,
    isDraggable: DEFAULT_ISDRAGGABLE,
    isListening: DEFAULT_ISLISTENING,
    isMouseDown: DEFAULT_ISMOUSEDOWN,
    directDraw: DEFAULT_DIRECTDRAW,
    samplesRequired: MIN_SAMPLE_COUNT,
    strokeSample: 0,
    liveStroke: new BoardLiveStroke(),
    liveStrokeUpdate: 0,
    pageBG: pageType.BLANK,
    favTools: DEFAULT_FAV_TOOLS,
    trNodes: [],
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
            state.isListening = type === ToolType.Eraser
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
            state.isDraggable = type === ToolType.Select
            state.isListening = type === ToolType.Eraser
            state.trNodes = []
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
                state.isDraggable = type === ToolType.Select
                state.isListening = type === ToolType.Eraser
            }
        },
        SET_ISMOUSEDOWN: (state, action) => {
            const isMouseDown = action.payload
            state.isMouseDown = isMouseDown
        },
        START_LIVESTROKE: (state, action) => {
            const [x, y] = action.payload
            state.liveStroke.pointsSegments = [[x, y]]
        },
        // Update the current live stroke position
        UPDATE_LIVESTROKE: (state, action) => {
            const { point, scale } = action.payload
            state.liveStroke.pointsSegments = state.liveStroke.updatePoints(
                point,
                scale,
                state.strokeSample
            )
            state.strokeSample += 1
            if (state.strokeSample >= state.samplesRequired) {
                state.strokeSample = 0
            }
            state.liveStrokeUpdate += 1
        },
        END_LIVESTROKE: (state) => {
            state.liveStroke.reset()
            state.strokeSample = 0
            state.liveStrokeUpdate = 0
        },
        SET_DEFAULT_PAGEBG: (state, action) => {
            state.pageBG = action.payload
        },
        SET_SAMPLE_COUNT: (state, action) => {
            state.samplesRequired = action.payload
        },
        TOGGLE_DIRECTDRAW: (state) => {
            state.directDraw = !state.directDraw
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
    INCREMENT_WIDTH,
    DECREMENT_WIDTH,
    SET_TYPE,
    SET_ISPANMODE,
    TOGGLE_PANMODE,
    SET_ISMOUSEDOWN,
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    SET_DEFAULT_PAGEBG,
    SET_SAMPLE_COUNT,
    TOGGLE_DIRECTDRAW,
    SET_TR_NODES,
} = drawControlSlice.actions
export default drawControlSlice.reducer
