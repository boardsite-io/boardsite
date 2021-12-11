import { JUMP_TO_NEXT_PAGE, JUMP_TO_PREV_PAGE } from "redux/board/board"
import store from "redux/store"
import { handleSetTool, handleRedo, handleUndo } from "drawing/handlers"
import { ToolType } from "drawing/stroke/index.types"
import { saveWorkspace } from "redux/workspace"
import { useEffect } from "react"

export const useKeyboardShortcuts = (): void => {
    useEffect(() => {
        document.addEventListener("keydown", keyListener)
        return () => {
            document.removeEventListener("keydown", keyListener)
        }
    }, [])
}

const keyListener = (e: KeyboardEvent): void => {
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
            handleSetTool({ type: ToolType.Pen })
            break
        case "2":
            handleSetTool({ type: ToolType.Eraser })
            break
        case "3":
            handleSetTool({ type: ToolType.Select })
            break
        case "4":
            handleSetTool({ type: ToolType.Pan })
            break
        case "5":
            handleSetTool({ type: ToolType.Line })
            break
        case "6":
            handleSetTool({ type: ToolType.Rectangle })
            break
        case "7":
            handleSetTool({ type: ToolType.Circle })
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
        case "s":
            saveWorkspace("test", store.getState().board)
            break
        default:
            break
    }
}
