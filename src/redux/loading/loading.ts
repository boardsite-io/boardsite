import { createSlice } from "@reduxjs/toolkit"

export interface LoadingState {
    isLoading: boolean
    message: string
}

const initState: LoadingState = {
    isLoading: false,
    message: "Loading...",
}

const loadingSlice = createSlice({
    name: "loading",
    initialState: initState,
    reducers: {
        START_LOADING: (state, action: { payload: string }) => {
            state.message = action.payload
            state.isLoading = true
        },
        END_LOADING: (state) => {
            state.isLoading = false
        },
    },
})

export const { START_LOADING, END_LOADING } = loadingSlice.actions
export default loadingSlice.reducer
