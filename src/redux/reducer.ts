import { combineReducers } from "@reduxjs/toolkit"
import boardReducer from "./board"

const rootReducer = {
    board: boardReducer,
}

export type ReducerState = keyof typeof rootReducer
export default combineReducers(rootReducer)
