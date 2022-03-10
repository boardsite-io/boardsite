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
    JoinOnly,
}

export type OnlineSubscription = "session" | "userSelection"

export type OnlineSubscribers = Record<OnlineSubscription, Subscribers>
