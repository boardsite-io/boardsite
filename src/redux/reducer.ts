import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board"
import drawingReducer from "./drawing"
import infoReducer from "./loading"
import menuReducer from "./menu"

const rootReducer = {
    board: boardReducer,
    drawing: drawingReducer,
    info: infoReducer,
    menu: menuReducer,
}

export type ReducerState = keyof typeof rootReducer
export default combineReducers(rootReducer)
