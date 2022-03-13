import { Theme } from "theme"
import { assign, cloneDeep, keys, pick } from "lodash"
import { ThemeState } from "../state/index.types"
import { SerializedState } from "../../index.types"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2021-10-22 - Added versioning
*/
export const CURRENT_THEME_VERSION = "1.0"

export const serializeThemeState = (
    state: ThemeState
): SerializedState<ThemeState> => {
    const stateClone = cloneDeep<ThemeState>(state)
    return { version: CURRENT_THEME_VERSION, ...stateClone }
}

export const deserializeThemeState = async (
    serialisedState: SerializedState<ThemeState>
): Promise<ThemeState> => {
    const newThemeState: ThemeState = { theme: Theme.Light }
    const { version } = serialisedState // avoid side-effects
    if (!version) {
        throw new Error("cannot deserialize state, missing version")
    }

    switch (version) {
        case CURRENT_THEME_VERSION:
            // latest version; no preprocessing required
            break

        default:
            throw new Error(
                `cannot deserialize state, unknown version ${version}`
            )
    }

    // update all valid keys
    assign(newThemeState, pick(serialisedState, keys(newThemeState)))

    return newThemeState
}
