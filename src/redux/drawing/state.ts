import {
    backgroundStyle,
    DEFAULT_COLOR,
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
    DEFAULT_ISDRAGGABLE,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    pageSize,
} from "consts"
import { pick, keys, assign, cloneDeep } from "lodash"
import { DrawingState, SerializedDrawingState } from "./index.types"

// version of the board state reducer to allow backward compatibility for stored data
//
// [1.0] - 2021-10-22 - Added versioning
export const drawingVersion = "1.0"

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
    pageMeta: {
        background: { style: backgroundStyle.BLANK },
        size: pageSize.a4portrait,
    },
    favoriteTools: DEFAULT_FAV_TOOLS,
    erasedStrokes: {},

    serialize(): SerializedDrawingState {
        const stateCopy = cloneDeep<SerializedDrawingState>(this)
        stateCopy.erasedStrokes = {}

        delete stateCopy.serialize
        delete stateCopy.deserialize

        return { version: drawingVersion, ...stateCopy }
    },

    async deserialize(parsed: SerializedDrawingState): Promise<DrawingState> {
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
                    `cannot deserialize state, unknown version ${version}`
                )
        }

        // update all valid keys
        assign(this, pick(parsed, keys(this)))

        return this
    },
    ...state,
})
