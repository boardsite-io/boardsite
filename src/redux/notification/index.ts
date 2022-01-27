import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IntlMessageKeys } from "language"

export interface NotificationState {
    notifications: IntlMessageKeys[]
}

const initState: NotificationState = {
    notifications: [],
}

const notificationSlice = createSlice({
    name: "notification",
    initialState: initState,
    reducers: {
        ADD_NOTIFICATION: (state, action: PayloadAction<IntlMessageKeys>) => {
            // Unshift to put latest notifications on top of the list
            state.notifications.unshift(action.payload)
        },
        REMOVE_NOTIFICATION: (state) => {
            state.notifications.pop()
        },
    },
})

export const { ADD_NOTIFICATION, REMOVE_NOTIFICATION } =
    notificationSlice.actions
export default notificationSlice.reducer
