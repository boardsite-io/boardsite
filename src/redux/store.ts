import { configureStore } from "@reduxjs/toolkit"
import { save, load } from "redux-localstorage-simple"
import * as boardState from "./board/board"
import * as drawingState from "./drawing/drawing"
import rootReducer from "./reducer"

const store = configureStore({
    reducer: rootReducer,
    middleware: [
        save({
            states: ["board", "drawing"],
            namespace: "redux_local",
            debounce: 1000,
        }),
    ],
    preloadedState: transformState(
        load({
            states: ["board", "drawing"],
            namespace: "redux_local",
            immutablejs: false,
        })
    ),
})

function transformState(s: any): any {
    try {
        s.drawing = drawingState.deserialize(s.drawing)
    } catch {
        s.drawing = {}
    }

    try {
        s.board = boardState.deserialize(s.board)
    } catch {
        s.board = {}
    }

    return s
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
