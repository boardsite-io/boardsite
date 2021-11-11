export interface WebControlState {
    sessionDialog: SessionDialog
    webSocket: WebSocket
    sessionId: SessionId
    user: User
    connectedUsers: ConnectedUsers
    apiURL: URL
}

export type SessionDialog = {
    open: boolean
    invalidSid: boolean
    joinOnly: boolean
    sidInput: string
}
type UserId = string
type UserAlias = string
type UserColor = string
export type User = {
    id: UserId
    alias: UserAlias
    color: UserColor
}
export type SessionId = string
export type ConnectedUsers = {
    [uid: string]: User
}

/* ------- Reducer Action Types ------- */
export type CreateWs = {
    ws: WebSocket
    sessionId: string
    user: User
}
export type UserConnect = User
export type UserDisconnect = User
export type SetSessionUsers = ConnectedUsers
export type SetSessionDialog = Partial<SessionDialog> // Partial makes props optional
export type SetUserAlias = UserAlias
export type SetApiUrl = URL
