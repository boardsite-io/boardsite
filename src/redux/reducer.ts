import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board/board"
import drawingReducer from "./drawing/drawing"
import webControlReducer from "./session/session"

export default combineReducers({
    board: boardReducer,
    drawing: drawingReducer,
    session: webControlReducer,
})
