import { combineReducers } from "@reduxjs/toolkit"
import boardControlReducer from "./slice/boardcontrol"
import drawControlReducer from "./slice/drawcontrol"
import viewControlReducer from "./slice/viewcontrol"

export default combineReducers({
    boardControl: boardControlReducer,
    drawControl: drawControlReducer,
    viewControl: viewControlReducer,
})
