import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board/board"
import drawingReducer from "./drawing/drawing"
import infoReducer from "./loading/loading"
import sessionReducer from "./session/session"
import undoReducer from "./undo/undo"

export default combineReducers({
    board: boardReducer,
    drawing: drawingReducer,
    info: infoReducer,
    session: sessionReducer,
    undo: undoReducer,
})
