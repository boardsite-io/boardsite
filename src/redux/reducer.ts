import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board"
import drawingReducer from "./drawing"
import infoReducer from "./loading"
import menuReducer from "./menu"
import sessionReducer from "./session"
import notificationReducer from "./notification"

const rootReducer = {
    board: boardReducer,
    drawing: drawingReducer,
    info: infoReducer,
    menu: menuReducer,
    session: sessionReducer,
    notification: notificationReducer,
}

export type ReducerState = keyof typeof rootReducer
export default combineReducers(rootReducer)
