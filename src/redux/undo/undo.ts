import { createSlice } from "@reduxjs/toolkit"
import { Stroke } from "drawing/stroke/types"

export interface DrawAction {
    strokes: Stroke[]
    handle: (stroke: Stroke[], isRedoable: boolean, forUndo: boolean) => void
}
export interface UndoState {
    undoStack: DrawAction[]
    redoStack: DrawAction[]
}
const initState: UndoState = {
    undoStack: [],
    redoStack: [],
}
const undoSlice = createSlice({
    name: "undo",
    initialState: initState,
    reducers: {
        UNDO_POP: (state) => {
            state.undoStack.pop()
        },
        REDO_POP: (state) => {
            state.redoStack.pop()
        },
        UNDO_PUSH: (state, action) => {
            state.undoStack.push(action.payload)
        },
        REDO_PUSH: (state, action) => {
            state.redoStack.push(action.payload)
        },
    },
})

export const { UNDO_POP, REDO_POP, UNDO_PUSH, REDO_PUSH } = undoSlice.actions
export default undoSlice.reducer
