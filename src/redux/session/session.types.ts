import { User } from "api/types"

export interface ConnectedUsers {
    [uid: string]: User
}
export interface SessionState {
    sessionDialog: {
        open: boolean
        invalidSid: boolean
        joinOnly: boolean
        sidInput: string
    }
    webSocket: WebSocket
    sessionId: string
    user: User
    connectedUsers: ConnectedUsers
    apiURL: URL
}
