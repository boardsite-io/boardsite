import { eraseStroke, isConnected, sendStroke } from "../api/websocket"
import {
    ADD_STROKE,
    ERASE_STROKE,
    UPDATE_STROKE,
} from "../redux/slice/boardcontrol"
import store from "../redux/store"
import { Stroke } from "../types"

interface DrawAction {
    stroke: Stroke
    handle: (stroke: Stroke, isRedoable: boolean, stack: DrawAction[]) => void
}

const undoStack: DrawAction[] = []
const redoStack: DrawAction[] = []

export function undo(): void {
    const undoStroke = undoStack.pop()
    if (undoStroke && undoStroke.stroke) {
        undoStroke.handle(undoStroke.stroke, true, redoStack)
    }
}

export function redo(): void {
    const redoStroke = redoStack.pop()
    if (redoStroke && redoStroke.stroke) {
        redoStroke.handle(redoStroke.stroke, true, undoStack)
    }
}

export function addStroke(
    stroke: Stroke,
    isRedoable = true,
    stack = undoStack
): void {
    const { pageId } = stroke
    const page = store.getState().boardControl.pageCollection[pageId]
    if (page) {
        if (isRedoable) {
            // Add to UndoStack
            stack.push({
                stroke,
                handle: deleteStroke,
            })
        }

        store.dispatch(ADD_STROKE(stroke))
        if (isConnected()) {
            // relay stroke in session
            sendStroke(stroke)
        }
    }
}

export function deleteStroke(
    { id, pageId }: Stroke,
    isRedoable = true,
    stack = undoStack
): void {
    const page = store.getState().boardControl.pageCollection[pageId]
    if (page) {
        const stroke = page.strokes[id] as Stroke
        if (isRedoable) {
            // Add to UndoStack
            stack.push({
                stroke,
                handle: addStroke,
            })
        }

        store.dispatch(ERASE_STROKE({ pageId, id }))
        if (isConnected()) {
            eraseStroke({ pageId, id } as Stroke)
        }
    }
}

export function updateStroke(
    { x, y, id, scaleX, scaleY, pageId }: Stroke,
    isRedoable = true,
    stack = undoStack
): void {
    const page = store.getState().boardControl.pageCollection[pageId]
    if (page) {
        const stroke = page.strokes[id]
        if (stroke) {
            if (isRedoable) {
                // Add to UndoStack
                stack.push({
                    stroke: {
                        x: stroke.x,
                        y: stroke.y,
                        id,
                        scaleX: stroke.scaleX,
                        scaleY: stroke.scaleY,
                        pageId,
                    } as Stroke, // make copy to redo update
                    handle: updateStroke,
                })
            }

            store.dispatch(UPDATE_STROKE({ x, y, id, scaleX, scaleY, pageId }))
            if (isConnected()) {
                // send updated stroke
                sendStroke(
                    store.getState().boardControl.pageCollection[pageId]
                        .strokes[id]
                )
            }
        }
    }
}
