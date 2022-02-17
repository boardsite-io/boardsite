import { Session } from "api/types"

export interface OnlineState {
    dialogState: DialogState
    session?: Session
}

export enum DialogState {
    Closed,
    InitialSelectionFirstLoad,
    InitialSelection,
    CreateOnlineSession,
    ManageOnlineSession,
    JoinOnly,
}
