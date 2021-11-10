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
    payload: {
        ws: WebSocket
        sessionId: string
        user: User
    }
}
export type UserConnect = {
    payload: User
}
export type UserDisconnect = {
    payload: User
}
export type SetSessionUsers = {
    payload: ConnectedUsers
}
export type SetSessionDialog = {
    payload: {
        open?: boolean
        invalidSid?: boolean
        joinOnly?: boolean
        sidInput?: string
    }
}
export type SetUserAlias = {
    payload: UserAlias
}
export type SetApiUrl = {
    payload: URL
}
