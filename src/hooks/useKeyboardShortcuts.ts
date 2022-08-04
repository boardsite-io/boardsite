import { ToolType } from "drawing/stroke/index.types"
import { useEffect } from "react"
import { drawing } from "state/drawing"
import { handleExportWorkspace, handleImportWorkspace } from "storage/workspace"
import { menu } from "state/menu"
import { view } from "state/view"
import { board } from "state/board"
import { action } from "state/action"

export const useKeyboardShortcuts = (): void => {
    useEffect(() => {
        document.addEventListener("keydown", keyListener)
        return () => {
            document.removeEventListener("keydown", keyListener)
        }
    }, [])
}

const keyListener = (e: KeyboardEvent): void => {
    // Don't trigger shortcuts while:
    // - in textfield
    // - in menus
    // - repeat spam
    if (board.getState().activeTextfield || menu.isAnyMenuOpen() || e.repeat) {
        return
    }

    if (e.ctrlKey) {
        switch (e.key) {
            case "z": // Undo
                action.undo()
                break
            case "y": // Redo
                action.redo()
                break
            case "n": // File -> New
                action.newWorkspace()
                break
            case "o": // File -> Open
                handleImportWorkspace()
                break
            case "s": // File -> Save
                handleExportWorkspace()
                break
            case "a": // Add Page Over
                action.addPageOver()
                break
            case "b": // Add Page Under
                action.addPageUnder()
                break
            case "d": // Delete Current Page
                action.deleteCurrentPage()
                break
            default:
                break
        }
    } else {
        // no ctrl
        switch (e.key) {
            case "1":
                action.setTool({
                    type:
                        drawing.getState().tool.latestDrawType ?? ToolType.Pen,
                })
                break
            case "2":
                action.setTool({ type: ToolType.Eraser })
                break
            case "3":
                action.setTool({ type: ToolType.Select })
                break
            case "4":
                action.setTool({ type: ToolType.Pan })
                break
            case "5":
                action.setTool({ type: ToolType.Pen })
                break
            case "6":
                action.setTool({ type: ToolType.Line })
                break
            case "7":
                action.setTool({ type: ToolType.Rectangle })
                break
            case "8":
                action.setTool({ type: ToolType.Circle })
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
