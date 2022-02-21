import { Session } from "api/types"
import { Subscribers } from "state/index.types"

export interface OnlineState {
    dialogState: DialogState
    session?: Session
    token?: string
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
