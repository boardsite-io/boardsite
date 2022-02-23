import { OnlineState } from "../state/index.types"
import { SerializedState } from "../../index.types"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2022-02-22 - Added versioning
*/
export const CURRENT_ONLINE_VERSION = "1.0"

export const serializeOnlineState = (
    state: OnlineState
): SerializedState<OnlineState> => {
    const stateClone: Partial<OnlineState> = {
        token: state.token,
    }

    return { version: CURRENT_ONLINE_VERSION, ...stateClone }
}

export const deserializeOnlineToken = async (
    serialisedState: SerializedState<OnlineState>
): Promise<Partial<OnlineState>> => {
    const { version } = serialisedState // avoid side-effects
    if (!version) {
        throw new Error("cannot deserialize state, missing version")
    }

    switch (version) {
        case CURRENT_ONLINE_VERSION:
            // latest version; no preprocessing required
            break

        default:
            throw new Error(
                `cannot deserialize state, unknown version ${version}`
            )
    }

    return { token: serialisedState.token }
}
