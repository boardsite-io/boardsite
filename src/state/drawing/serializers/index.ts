import { assign, cloneDeep, keys, pick } from "lodash"
import { getDefaultDrawingState } from "../state/default"
import { DrawingState } from "../state/index.types"
import { SerializedState } from "../../index.types"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2021-10-22 - Added versioning
*/
export const CURRENT_DRAWING_VERSION = "1.0"

export const serializeDrawingState = (
    state: DrawingState
): SerializedState<DrawingState> => {
    const stateClone = cloneDeep<DrawingState>(state)
    stateClone.erasedStrokes = {}

    return { version: CURRENT_DRAWING_VERSION, ...stateClone }
}

export const deserializeDrawingState = async (
    serialisedState: SerializedState<DrawingState>
): Promise<DrawingState> => {
    const newDrawingState = getDefaultDrawingState()
    const { version } = serialisedState // avoid side-effects
    if (!version) {
        throw new Error("cannot deserialize state, missing version")
    }

    switch (version) {
        case CURRENT_DRAWING_VERSION:
            // latest version; no preprocessing required
            break

        default:
            throw new Error(
                `cannot deserialize state, unknown version ${version}`
            )
    }

    // update all valid keys
    assign(newDrawingState, pick(serialisedState, keys(newDrawingState)))

    return newDrawingState
}
