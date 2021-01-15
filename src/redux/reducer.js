import { combineReducers } from '@reduxjs/toolkit';

import boardControlReducer from "./slice/boardcontrol.js";
import drawControlReducer from "./slice/drawControl.js";

export default combineReducers({
    boardControl: boardControlReducer,
    drawControl: drawControlReducer
});
