import { configureStore, Middleware, AnyAction } from "@reduxjs/toolkit"
import { DialogState } from "state/online/state/index.types"
import { loadLocalStorage, saveIndexedDB, saveLocalStore } from "./localstorage"
import rootReducer from "./reducer"
import { RootState } from "./types"
import { online } from "../state/online"

export const localStoreMiddleware: Middleware<unknown, RootState> =
    (rootStore) => (next) => (action) => {
        const result = next(action)
        saveLocalStore(rootStore.getState(), "drawing")

        // Don't store board state in sessions
        const isOnline = online.getState().session?.isConnected()
        // Prevent overwriting local data on initial load
        const isSelecting = online.getState().dialogState !== DialogState.Closed

        if (!isOnline && !isSelecting) {
            saveIndexedDB(rootStore.getState(), "board")
        }

        return result
    }

const store = configureStore({
    reducer: rootReducer,
    middleware: [localStoreMiddleware],
})

// load the drawing state async
;(async () => {
    const state = await loadLocalStorage("drawing")
    store.dispatch({
        type: "drawing/LOAD",
        payload: state.drawing,
    } as AnyAction)
})()

export type ReduxStore = typeof store
export type AppDispatch = typeof store.dispatch
export default store
