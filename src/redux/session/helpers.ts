import { WebControlState } from "./session.types"

export function isConnectedState(state: WebControlState): boolean {
    return !!state.session?.isConnected()
}
