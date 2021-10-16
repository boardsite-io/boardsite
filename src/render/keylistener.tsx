import store from "redux/store"
import { handleRedo, handleUndo } from "redux/drawing/util/handlers"
import { ToolType } from "redux/drawing/drawing.types"

export default function keyListener(e: KeyboardEvent): void {
    switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
            store.dispatch({
                type: "JUMP_TO_PREV_PAGE",
                payload: undefined,
            })
            break
        case "ArrowDown":
        case "ArrowRight":
            store.dispatch({
                type: "JUMP_TO_NEXT_PAGE",
                payload: undefined,
            })
            break
        case "1":
            store.dispatch({
                type: "SET_TYPE",
                payload: ToolType.Pen,
            })
            break
        case "2":
            store.dispatch({
                type: "SET_TYPE",
                payload: ToolType.Eraser,
            })
            break
        case "3":
            store.dispatch({
                type: "SET_TYPE",
                payload: ToolType.Select,
            })
            break
        case "4":
            store.dispatch({
                type: "SET_TYPE",
                payload: ToolType.Pan,
            })
            break
        case "5":
            store.dispatch({
                type: "SET_TYPE",
                payload: ToolType.Line,
            })
            break
        case "6":
            store.dispatch({
                type: "SET_TYPE",
                payload: ToolType.Rectangle,
            })
            break
        case "7":
            store.dispatch({
                type: "SET_TYPE",
                payload: ToolType.Circle,
            })
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
