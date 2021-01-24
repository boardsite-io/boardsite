import { combineReducers } from "@reduxjs/toolkit"
import boardControlReducer from "./slice/boardcontrol"
import drawControlReducer from "./slice/drawcontrol"

export default combineReducers({
    boardControl: boardControlReducer,
    drawControl: drawControlReducer,
})
