import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
    CreateSession,
    SetSessionDialog,
    WebControlState,
} from "./session.types"

const initState: WebControlState = {
    sessionDialog: {
        open: false,
        invalidSid: false,
        joinOnly: false,
        sidInput: "",
    },
}

const sessionSlice = createSlice({
    name: "session",
    initialState: initState,
    reducers: {
        CREATE_SESSION: (state, action: PayloadAction<CreateSession>) => {
            const { session } = action.payload
            state.session = session
        },
        SET_SESSION_DIALOG: (
            state,
            action: PayloadAction<SetSessionDialog>
        ) => {
            state.sessionDialog = { ...state.sessionDialog, ...action.payload }
        },
        CLOSE_SESSION_DIALOG: (state) => {
            state.sessionDialog = {
                open: false,
                invalidSid: false,
                joinOnly: false,
                sidInput: "",
            }
        },
    },
})

export const { CREATE_SESSION, SET_SESSION_DIALOG, CLOSE_SESSION_DIALOG } =
    sessionSlice.actions
export default sessionSlice.reducer
