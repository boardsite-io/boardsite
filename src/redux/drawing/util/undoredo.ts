import { eraseStrokes, isConnected, sendStrokes } from "api/websocket"
import store from "redux/store"
import { Stroke } from "../drawing.types"

interface DrawAction {
    strokes: Stroke[]
    handle: (stroke: Stroke[], isRedoable: boolean, stack: DrawAction[]) => void
}

const undoStack: DrawAction[] = []
const redoStack: DrawAction[] = []

export function undo(): void {
    const undoStroke = undoStack.pop()
    if (undoStroke) {
        undoStroke.handle(undoStroke.strokes, true, redoStack)
    }
}

export function redo(): void {
    const redoStroke = redoStack.pop()
    if (redoStroke) {
        redoStroke.handle(redoStroke.strokes, true, undoStack)
    }
}

export function addStrokes(
    strokes: Stroke[],
    isRedoable = true,
    stack = undoStack
): void {
    if (isRedoable) {
        // Add to UndoStack
        stack.push({
            strokes,
            handle: deleteStrokes,
        })
    }

    store.dispatch({
        type: "ADD_STROKES",
        payload: strokes,
    })
    if (isConnected()) {
        // relay stroke in session
        sendStrokes(strokes)
    }
}

export function deleteStrokes(
    strokes: Stroke[],
    isRedoable = true,
    stack = undoStack
): void {
    if (isRedoable) {
        // Add to UndoStack
        stack.push({
            // reference the delete stroke for redo
            strokes: strokes.map(
                (s) =>
                    store.getState().board.pageCollection[s.pageId].strokes[
                        s.id
                    ]
            ),
            handle: addStrokes,
        })
    }

    // remove selection to prevent undefined refs in transformer
    store.dispatch({
        type: "SET_TR_NODES",
        payload: [],
    })
    store.dispatch({
        type: "ERASE_STROKES",
        payload: strokes,
    })
    if (isConnected()) {
        eraseStrokes(strokes)
    }
}

export function updateStrokes(
    strokes: Stroke[],
    isRedoable = true,
    stack = undoStack
): void {
    if (isRedoable) {
        // Add to UndoStack
        stack.push({
            strokes: strokes
                .map((s) => {
                    // save values of the current stroke
                    const cur =
                        store.getState().board.pageCollection[s.pageId]
                            ?.strokes[s.id]
                    return cur
                        ? ({
                              id: s.id,
                              pageId: s.pageId,
                              x: cur.x,
                              y: cur.y,
                              scaleX: cur.scaleX,
                              scaleY: cur.scaleY,
                          } as Stroke) // make copy to redo update
                        : undefined
                })
                .filter((s) => s !== undefined) as Stroke[], // filter out invalid strokes
            handle: updateStrokes,
        })
    }

    store.dispatch({
        type: "UPDATE_STROKES",
        payload: strokes,
    })

    if (isConnected()) {
        // send updated stroke
        sendStrokes(
            strokes.map(
                (s) =>
                    store.getState().board.pageCollection[s.pageId]?.strokes[
                        s.id
                    ]
            )
        )
    }
}
