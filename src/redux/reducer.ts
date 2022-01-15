import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board/board"
import drawingReducer from "./drawing/drawing"
import infoReducer from "./loading/loading"
import menuReducer from "./menu/menu"
import sessionReducer from "./session/session"

const rootReducer = {
    board: boardReducer,
    drawing: drawingReducer,
    info: infoReducer,
    menu: menuReducer,
    session: sessionReducer,
}

export type ReducerState = keyof typeof rootReducer
export default combineReducers(rootReducer)
