import { configureStore, Middleware } from "@reduxjs/toolkit"
import { load, save } from "./localstorage"
import rootReducer from "./reducer"
import { isConnectedState } from "./session/helpers"
import { RootState } from "./types"

export const localStoreMiddleware: Middleware<unknown, RootState> =
    (rootStore) => (next) => (action) => {
        const result = next(action)
        if (!isConnectedState(store.getState().session)) {
            save(rootStore.getState())
        }
        return result
    }

const store = configureStore({
    reducer: rootReducer,
    middleware: [localStoreMiddleware],
    preloadedState: load() as object,
})

export type AppDispatch = typeof store.dispatch
export default store
