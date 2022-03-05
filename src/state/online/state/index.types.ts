import { Session, User } from "api/types"
import { Subscribers } from "state/index.types"

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
    ManageOnlineSession,
    JoinOnly,
}

export type OnlineSubscribers = {
    session: Subscribers
}

export type OnlineSubscription = keyof OnlineSubscribers
