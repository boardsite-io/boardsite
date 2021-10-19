import {
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
    DEFAULT_ISDRAGGABLE,
    DEFAULT_ISMOUSEDOWN,
} from "consts"
import { BoardLiveStroke } from "drawing/stroke/livestroke"
import { StrokeMap, Tool } from "drawing/stroke/types"
import { TrNodesType } from "types"

export interface DrawingState {
    isDraggable: boolean
    isMouseDown: boolean
    directDraw: boolean
    liveStroke: BoardLiveStroke
    liveStrokeUpdate: number
    favTools: Tool[]
    trNodes: TrNodesType
    erasedStrokes: StrokeMap

    serialize?(): string
    deserialize?(state: string): DrawingState
}

export const newState = (state?: DrawingState): DrawingState => ({
    isDraggable: DEFAULT_ISDRAGGABLE,
    isMouseDown: DEFAULT_ISMOUSEDOWN,
    directDraw: DEFAULT_DIRECTDRAW,
    liveStroke: new BoardLiveStroke(),
    liveStrokeUpdate: 0,
    favTools: DEFAULT_FAV_TOOLS,
    trNodes: [],
    erasedStrokes: {},

    serialize(): string {
        const stateCopy = { ...this }
        stateCopy.liveStroke.points = []
        stateCopy.liveStroke.pointsSegments = []
        stateCopy.liveStrokeUpdate = 0
        stateCopy.trNodes = []
        stateCopy.erasedStrokes = {}
        return JSON.stringify(stateCopy)
    },

    deserialize(stateStr: string): DrawingState {
        Object.assign(this, JSON.parse(stateStr))
        this.liveStroke = new BoardLiveStroke(this.liveStroke) // deserialize a new instance
        return this
    },

    ...state,
})
