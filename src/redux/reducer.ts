import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board"
import drawingReducer from "./drawing"

const rootReducer = {
    board: boardReducer,
    drawing: drawingReducer,
}

export type ReducerState = keyof typeof rootReducer
export default combineReducers(rootReducer)
