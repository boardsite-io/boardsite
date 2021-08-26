import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./reducer"

const store = configureStore({
    reducer: rootReducer,
    middleware: [], // disable middleware
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
