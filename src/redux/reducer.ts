import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board"
import drawingReducer from "./drawing"
import infoReducer from "./loading"

const rootReducer = {
    board: boardReducer,
    drawing: drawingReducer,
    info: infoReducer,
}

export type ReducerState = keyof typeof rootReducer
export default combineReducers(rootReducer)
