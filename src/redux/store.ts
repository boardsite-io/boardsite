import { configureStore } from "@reduxjs/toolkit"
// eslint-disable-next-line import/no-cycle
import rootReducer from "./reducer"

const store = configureStore({
    reducer: rootReducer,
    middleware: [], // disable middleware
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
