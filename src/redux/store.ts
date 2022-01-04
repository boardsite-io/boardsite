import { configureStore, Middleware } from "@reduxjs/toolkit"
import { loadLocalStorage, saveIndexedDB, saveLocalStore } from "./localstorage"
import rootReducer from "./reducer"
import { isConnectedState } from "./session/helpers"
import { DialogState } from "./session/session.types"
import { RootState } from "./types"

export const localStoreMiddleware: Middleware<unknown, RootState> =
    (rootStore) => (next) => (action) => {
        const result = next(action)
        saveLocalStore(rootStore.getState(), "drawing")

        // Don't store board state in sessions
        const isOnline = isConnectedState(rootStore.getState().session)
        // Prevent overwriting local data on initial load
        const isSelecting =
            rootStore.getState().session.dialogState !== DialogState.Closed

        if (!isOnline && !isSelecting) {
            saveIndexedDB(rootStore.getState(), "board")
        }

        return result
    }

const store = configureStore({
    reducer: rootReducer,
    middleware: [localStoreMiddleware],
    preloadedState: loadLocalStorage("drawing") as object,
})

export type AppDispatch = typeof store.dispatch
export default store
