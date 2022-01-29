import { WebControlState } from "./index.types"

export function isConnectedState(state: WebControlState): boolean {
    return !!state.session?.isConnected()
}
