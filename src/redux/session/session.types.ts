import { Session } from "api/types"

export interface WebControlState {
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

/* ------- Reducer Action Types ------- */
export type SetSessionDialog = DialogState
export type CreateSession = Record<"session", Session>
