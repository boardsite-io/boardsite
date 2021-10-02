import { JUMP_TO_NEXT_PAGE, JUMP_TO_PREV_PAGE } from "redux/slice/boardcontrol"
import { SET_TYPE } from "../redux/slice/drawcontrol"
import store from "../redux/store"
import { handleRedo, handleUndo } from "../drawing/handlers"
import { ToolType } from "../drawing/stroke/types"

export default function keyListener(e: KeyboardEvent): void {
    switch (e.key) {
        case "ArrowUp":
            store.dispatch(JUMP_TO_PREV_PAGE())
            break
        case "ArrowLeft":
            store.dispatch(JUMP_TO_PREV_PAGE())
            break
        case "ArrowDown":
            store.dispatch(JUMP_TO_NEXT_PAGE())
            break
        case "ArrowRight":
            store.dispatch(JUMP_TO_NEXT_PAGE())
            break
        case "1":
            store.dispatch(SET_TYPE(ToolType.Pen))
            break
        case "2":
            store.dispatch(SET_TYPE(ToolType.Eraser))
            break
        case "3":
            store.dispatch(SET_TYPE(ToolType.Select))
            break
        case "4":
            store.dispatch(SET_TYPE(ToolType.Pan))
            break
        case "5":
            store.dispatch(SET_TYPE(ToolType.Line))
            break
        case "6":
            store.dispatch(SET_TYPE(ToolType.Rectangle))
            break
        case "7":
            store.dispatch(SET_TYPE(ToolType.Circle))
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
        // case " ": // Spacebar - UNSET
        //     break
        default:
            break
    }
}
