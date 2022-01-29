import {
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_LAST_PAGE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
} from "redux/board"
import store from "redux/store"
import {
    handleSetTool,
    handleRedo,
    handleUndo,
    handleDeleteAllPages,
    handleAddPageUnder,
    handleAddPageOver,
    handleDeleteCurrentPage,
} from "drawing/handlers"
import { ToolType } from "drawing/stroke/index.types"
import { useEffect } from "react"
import { handleExportWorkspace, handleImportWorkspace } from "drawing/io"
import { MainMenuState } from "redux/menu/index.types"

export const useKeyboardShortcuts = (): void => {
    useEffect(() => {
        document.addEventListener("keydown", keyListener)
        return () => {
            document.removeEventListener("keydown", keyListener)
        }
    }, [])
}

// Check if any menu is open
const isInMenu = (): boolean => {
    const { aboutOpen, mainMenuState, shortcutsOpen } = store.getState().menu

    return aboutOpen || mainMenuState !== MainMenuState.Closed || shortcutsOpen
}

const keyListener = (e: KeyboardEvent): void => {
    // Avoid triggering shortcuts while in menus
    // Avoid repeat spam
    if (isInMenu() || e.repeat) {
        return
    }

    if (e.ctrlKey) {
        switch (e.key) {
            case "z": // Undo
                handleUndo()
                break
            case "y": // Redo
                handleRedo()
                break
            case "n": // File -> New
                handleDeleteAllPages()
                handleAddPageUnder()
                break
            case "o": // File -> Open
                handleImportWorkspace()
                break
            case "s": // File -> Save
                handleExportWorkspace()
                break
            case "a": // Add Page Over
                handleAddPageOver()
                break
            case "b": // Add Page Under
                handleAddPageUnder()
                break
            case "d": // Delete Current Page
                handleDeleteCurrentPage()
                break
            default:
                break
        }
    } else {
        // no ctrl
        switch (e.key) {
            case "1":
                handleSetTool({
                    type:
                        store.getState().drawing.tool.latestDrawType ??
                        ToolType.Pen,
                })
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
                handleSetTool({ type: ToolType.Pen })
                break
            case "6":
                handleSetTool({ type: ToolType.Line })
                break
            case "7":
                handleSetTool({ type: ToolType.Rectangle })
                break
            case "8":
                handleSetTool({ type: ToolType.Circle })
                break
            case "ArrowUp":
                store.dispatch(JUMP_TO_FIRST_PAGE())
                break
            case "ArrowDown":
                store.dispatch(JUMP_TO_LAST_PAGE())
                break
            case "ArrowLeft":
                store.dispatch(JUMP_TO_PREV_PAGE())
                break
            case "ArrowRight":
                store.dispatch(JUMP_TO_NEXT_PAGE())
                break
            default:
                break
        }
    }
}
