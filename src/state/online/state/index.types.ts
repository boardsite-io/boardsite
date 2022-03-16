import { Session, User } from "api/types"

export interface OnlineState {
    dialogState: DialogState
    userSelection: User
    session?: Session
    token?: string
    isConnected: () => boolean
    isAuthorized: () => boolean
    isSignedIn: () => boolean
}

export enum DialogState {
    Closed,
    InitialSelectionFirstLoad,
    InitialSelection,
    CreateOnlineSession,
    JoinOnly,
}
