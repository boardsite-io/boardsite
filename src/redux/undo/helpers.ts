import { Stroke } from "drawing/stroke/types"
import { eraseStrokes, isConnected, sendStrokes } from "../../api/websocket"
import { ADD_STROKES, ERASE_STROKES, UPDATE_STROKES } from "../board/board"
import { SET_TR_NODES } from "../drawing/drawing"
import store from "../store"
import { DrawAction, REDO_POP, REDO_PUSH, UNDO_POP, UNDO_PUSH } from "./undo"

export function undo(): void {
    const undoStroke = store.getState().undo.undoStack.slice().pop()
    store.dispatch(UNDO_POP())
    if (undoStroke) {
        undoStroke.handle(undoStroke.strokes, true, false)
    }
}

export function redo(): void {
    const redoStroke = store.getState().undo.redoStack.slice().pop()
    store.dispatch(REDO_POP())
    if (redoStroke) {
        redoStroke.handle(redoStroke.strokes, true, true)
    }
}

const dispatchStackPush = (forUndo: boolean, payload: DrawAction) =>
    forUndo
        ? store.dispatch(UNDO_PUSH(payload))
        : store.dispatch(REDO_PUSH(payload))

export function addStrokes(
    strokes: Stroke[],
    isRedoable = true,
    forUndo = true
): void {
    if (isRedoable) {
        dispatchStackPush(forUndo, {
            strokes,
            handle: deleteStrokes,
        })
    }

    store.dispatch(ADD_STROKES(strokes))
    if (isConnected()) {
        // relay stroke in session
        sendStrokes(strokes)
    }
}

export function deleteStrokes(
    strokes: Stroke[],
    isRedoable = true,
    forUndo = true
): void {
    if (isRedoable) {
        dispatchStackPush(forUndo, {
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

    store.dispatch(SET_TR_NODES([])) // remove selection to prevent undefined refs in transformer
    store.dispatch(ERASE_STROKES(strokes))
    if (isConnected()) {
        eraseStrokes(strokes)
    }
}

export function updateStrokes(
    strokes: Stroke[],
    isRedoable = true,
    forUndo = true
): void {
    if (isRedoable) {
        dispatchStackPush(forUndo, {
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

    store.dispatch(UPDATE_STROKES(strokes))
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
