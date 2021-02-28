// import { ActionCreators as UndoActionCreators } from "redux-undo"
import { toolType } from "../../constants"
import { SET_TYPE, TOGGLE_PANMODE } from "../../redux/slice/drawcontrol"
import store from "../../redux/store"

import {
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
} from "../../redux/slice/viewcontrol"
import { handleRedo, handleUndo } from "./request_handlers"

export default function keyListener(e) {
    switch (e.key) {
        case "ArrowUp": // Previous Page
            store.dispatch(JUMP_TO_PREV_PAGE())
            break
        case "ArrowDown": // Next Page
            store.dispatch(JUMP_TO_NEXT_PAGE())
            break
        // case "ArrowLeft": // ???
        //     store.dispatch(FUNC())
        //     break
        // case "ArrowRight": // ???
        //     store.dispatch(FUNC())
        //     break
        case "p": // Pen
            store.dispatch(SET_TYPE(toolType.PEN))
            break
        case "1": // Pen
            store.dispatch(SET_TYPE(toolType.PEN))
            break
        case "e": // Eraser
            store.dispatch(SET_TYPE(toolType.ERASER))
            break
        case "2": // Eraser
            store.dispatch(SET_TYPE(toolType.ERASER))
            break
        case "d": // Drag
            store.dispatch(SET_TYPE(toolType.DRAG))
            break
        case "3": // Drag
            store.dispatch(SET_TYPE(toolType.DRAG))
            break
        case "l": // Line
            store.dispatch(SET_TYPE(toolType.LINE))
            break
        case "4": // Line
            store.dispatch(SET_TYPE(toolType.LINE))
            break
        case "t": // Triangle
            store.dispatch(SET_TYPE(toolType.TRIANGLE))
            break
        case "5": // Triangle
            store.dispatch(SET_TYPE(toolType.TRIANGLE))
            break
        case "c": // Circle
            store.dispatch(SET_TYPE(toolType.CIRCLE))
            break
        case "6": // Circle
            store.dispatch(SET_TYPE(toolType.CIRCLE))
            break
        case "z": // Undo (Ctrl + Z)
            if (e.ctrlKey && !e.repeat) {
                handleUndo()
            }
            break
        case "y": // Redo (Ctrl + Y)
            if (e.ctrlKey && !e.repeat) {
                handleRedo()
            }
            break
        case " ": // Undo (Ctrl + Z)
            store.dispatch(TOGGLE_PANMODE())
            break
        default:
            break
    }
}
