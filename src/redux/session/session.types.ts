import { Session } from "api/types"

export interface WebControlState {
    sessionDialog: SessionDialog
    session?: Session
}

export type SessionDialog = {
    open: boolean
    showInitialOptions: boolean
    invalidSid: boolean
    joinOnly: boolean
    sidInput: string
}

/* ------- Reducer Action Types ------- */
export type SetSessionDialog = Partial<SessionDialog>
export type CreateSession = Record<"session", Session>
