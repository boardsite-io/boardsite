import { combineReducers } from "@reduxjs/toolkit"
import boardControlReducer from "./slice/boardcontrol"
import drawControlReducer from "./slice/drawcontrol"
import viewControlReducer from "./slice/viewcontrol"
import webControlReducer from "./slice/webcontrol"

export default combineReducers({
    boardControl: boardControlReducer,
    drawControl: drawControlReducer,
    viewControl: viewControlReducer,
    webControl: webControlReducer,
})
