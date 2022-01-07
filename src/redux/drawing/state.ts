import {
    DEFAULT_COLOR,
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
    DEFAULT_ISDRAGGABLE,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
} from "consts"
import { StrokeMap, Tool } from "drawing/stroke/index.types"
import { pick, keys, assign, cloneDeep } from "lodash"

// version of the board state reducer to allow backward compatibility for stored data
//
// [1.0] - 2021-10-22 - Added versioning
export const drawingVersion = "1.0"

export interface DrawingState {
    isDraggable: boolean
    directDraw: boolean
    tool: Tool
    favTools: Tool[]
    erasedStrokes: StrokeMap

    serialize?(): SerializedDrawingState
    deserialize?(parsed: SerializedDrawingState): DrawingState
}

export type SerializedDrawingState = DrawingState & { version?: string }

export const newState = (state?: DrawingState): DrawingState => ({
    isDraggable: DEFAULT_ISDRAGGABLE,
    directDraw: DEFAULT_DIRECTDRAW,
    tool: {
        type: DEFAULT_TOOL,
        latestDrawType: DEFAULT_TOOL,
        style: {
            color: DEFAULT_COLOR,
            width: DEFAULT_WIDTH,
            opacity: 1,
        },
    },
    favTools: DEFAULT_FAV_TOOLS,
    erasedStrokes: {},

    serialize(): SerializedDrawingState {
        const stateCopy = cloneDeep<SerializedDrawingState>(this)
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
