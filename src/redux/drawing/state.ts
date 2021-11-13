import {
    DEFAULT_COLOR,
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
    DEFAULT_ISDRAGGABLE,
    DEFAULT_ISMOUSEDOWN,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
} from "consts"
import { StrokeMap, Tool } from "drawing/stroke/types"
import { pick, keys, assign, cloneDeep } from "lodash"
import { TrNodesType } from "types"

// version of the board state reducer to allow backward compatibility for stored data
//
// [1.0] - 2021-10-22 - Added versioning
export const drawingVersion = "1.0"

export interface DrawingState {
    isDraggable: boolean
    isMouseDown: boolean
    directDraw: boolean
    liveStroke: Tool
    favTools: Tool[]
    trNodes: TrNodesType
    erasedStrokes: StrokeMap

    serialize?(): SerializedDrawingState
    deserialize?(parsed: SerializedDrawingState): DrawingState
}

export type SerializedDrawingState = DrawingState & { version?: string }

export const newState = (state?: DrawingState): DrawingState => ({
    isDraggable: DEFAULT_ISDRAGGABLE,
    isMouseDown: DEFAULT_ISMOUSEDOWN,
    directDraw: DEFAULT_DIRECTDRAW,
    liveStroke: {
        type: DEFAULT_TOOL,
        style: {
            color: DEFAULT_COLOR,
            width: DEFAULT_WIDTH,
            opacity: 1,
        },
    },
    favTools: DEFAULT_FAV_TOOLS,
    trNodes: [],
    erasedStrokes: {},

    serialize(): SerializedDrawingState {
        const stateCopy = cloneDeep<SerializedDrawingState>(this)
        stateCopy.trNodes = []
        stateCopy.erasedStrokes = {}

        delete stateCopy.serialize
        delete stateCopy.deserialize

        return { version: drawingVersion, ...stateCopy }
    },

    deserialize(parsed: SerializedDrawingState): DrawingState {
        const { version } = parsed // avoid side-effects
        if (!version) {
            throw new Error("cannot deserialize state, missing version")
        }

        switch (version) {
            case drawingVersion:
                // latest version; no preprocessing required
                break

            default:
                throw new Error(
                    `cannot deserialize state, unkown version ${version}`
                )
        }

        // update all valid keys
        assign(this, pick(parsed, keys(this)))

        return this
    },

    ...state,
})
