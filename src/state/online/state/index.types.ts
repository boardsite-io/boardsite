export interface OnlineState {
    user: User
    session: Session
    token?: string
    isAuthorized: boolean
}

export type Session = {
    config?: SessionConfig
    secret?: string
    socket?: WebSocket
    users?: ConnectedUsers
}

export type ConnectedUsers = Record<string, User>

export type SessionConfig = {
    id: string
    host: string
    maxUsers: number
    readOnly: boolean
    password: string
}

export type User = {
    id?: string
    alias: string
    color: string
}
