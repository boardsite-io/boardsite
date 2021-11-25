import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board/board"
import drawingReducer from "./drawing/drawing"
import infoReducer from "./loading/loading"
import menuReducer from "./menu/menu"
import sessionReducer from "./session/session"

export default combineReducers({
    board: boardReducer,
    drawing: drawingReducer,
    info: infoReducer,
    menu: menuReducer,
    session: sessionReducer,
})
