import { SerializedVersionState } from "../../types"

interface State {
    user: User
    token?: string
}

export interface OnlineState extends State {
    session: Session
    isAuthorized: boolean
}

export type SerializedOnlineState = SerializedVersionState<State>

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
