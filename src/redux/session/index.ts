import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
    CreateSession,
    DialogState,
    SetSessionDialog,
    WebControlState,
} from "./index.types"

const initState: WebControlState = {
    dialogState: DialogState.InitialSelectionFirstLoad,
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
            state.dialogState = action.payload
        },
    },
})

export const { CREATE_SESSION, SET_SESSION_DIALOG } = sessionSlice.actions
export default sessionSlice.reducer
