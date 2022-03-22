import { Session, User } from "api/types"

export interface OnlineState {
    user: User
    session?: Session
    token?: string
    isConnected: () => boolean
    isAuthorized: () => boolean
    isSignedIn: () => boolean
}
