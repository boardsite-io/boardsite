import { WebControlState } from "./session.types"

export function isConnectedState(state: WebControlState): boolean {
    return (
        state.sessionId !== "" &&
        state.webSocket != null &&
        state.webSocket.readyState === WebSocket.OPEN
    )
}
