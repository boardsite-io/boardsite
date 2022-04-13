import {
    handleSetTool,
    handleRedo,
    handleUndo,
    handleAddPageUnder,
    handleAddPageOver,
    handleDeleteCurrentPage,
    handleNewWorkspace,
} from "drawing/handlers"
import { ToolType } from "drawing/stroke/index.types"
import { useEffect } from "react"
import { drawing } from "state/drawing"
import { handleExportWorkspace, handleImportWorkspace } from "storage/workspace"
import { menu } from "state/menu"
import { view } from "state/view"

export const useKeyboardShortcuts = (): void => {
    useEffect(() => {
        document.addEventListener("keydown", keyListener)
        return () => {
            document.removeEventListener("keydown", keyListener)
        }
    }, [])
}

const keyListener = (e: KeyboardEvent): void => {
    // Avoid triggering shortcuts while in menus
    // Avoid repeat spam
    if (menu.isAnyMenuOpen() || e.repeat) {
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
                handleNewWorkspace()
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
                        drawing.getState().tool.latestDrawType ?? ToolType.Pen,
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
                view.jumpToFirstPage()
                break
            case "ArrowDown":
                view.jumpToLastPage()
                break
            case "ArrowLeft":
                view.jumpToPrevPage()
                break
            case "ArrowRight":
                view.jumpToNextPage()
                break
            default:
                break
        }
    }
}
