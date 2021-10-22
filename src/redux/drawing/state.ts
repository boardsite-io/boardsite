import {
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
    DEFAULT_ISDRAGGABLE,
    DEFAULT_ISMOUSEDOWN,
} from "consts"
import { BoardLiveStroke } from "drawing/stroke/livestroke"
import { StrokeMap, Tool } from "drawing/stroke/types"
import { TrNodesType } from "types"

// version of the board state reducer to allow backward compatibility for stored data
//
// [1.0] - 2021-10-22 - Added versioning
export const drawingVersion = "1.0"

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
        const stateCopy = { version: drawingVersion, ...this }
        stateCopy.liveStroke.points = []
        stateCopy.liveStroke.pointsSegments = []
        stateCopy.liveStrokeUpdate = 0
        stateCopy.trNodes = []
        stateCopy.erasedStrokes = {}
        return JSON.stringify(stateCopy)
    },

    deserialize(stateStr: string): DrawingState {
        const parsed = JSON.parse(stateStr)
        const { version } = parsed
        if (!version) {
            throw new Error("cannot deserialize state, missing version")
        }
        delete parsed.version

        switch (version) {
            case drawingVersion:
                // latest version; no preprocessing required
                break

            default:
                throw new Error(
                    `cannot deserialize state, unkown version ${version}`
                )
        }

        Object.assign(this, parsed)
        this.liveStroke = new BoardLiveStroke(this.liveStroke) // deserialize a new instance
        return this
    },

    ...state,
})
