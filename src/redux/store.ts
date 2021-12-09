import { configureStore, Middleware, AnyAction } from "@reduxjs/toolkit"
import {
    loadIndexedDB,
    loadLocalStorage,
    saveIndexedDB,
    saveLocalStore,
} from "./localstorage"
import rootReducer from "./reducer"
import { isConnectedState } from "./session/helpers"
import { RootState } from "./types"

export const localStoreMiddleware: Middleware<unknown, RootState> =
    (rootStore) => (next) => (action) => {
        const result = next(action)
        saveLocalStore(rootStore.getState(), "drawing")

        // dont store board state in sessions
        if (!isConnectedState(rootStore.getState().session)) {
            saveIndexedDB(rootStore.getState(), "board")
        }

        return result
    }

const store = configureStore({
    reducer: rootReducer,
    middleware: [localStoreMiddleware],
    preloadedState: loadLocalStorage("drawing") as object,
})

// load the board state async
;(async () => {
    const state = await loadIndexedDB("board")

    store.dispatch({
        type: "board/LOAD_BOARD_STATE",
        payload: state.board,
    } as AnyAction)
})()

export type AppDispatch = typeof store.dispatch
export default store
