import { Stroke } from "drawing/stroke/types"
import { BoardState, BoardAction } from "./state"

export function undo(state: BoardState): void {
    const undoStroke = state.undoStack?.pop()
    if (undoStroke) {
        undoStroke.handleFunc(state, undoStroke.strokes, true, state.redoStack)
    }
}

export function redo(state: BoardState): void {
    const redoStroke = state.redoStack?.pop()
    if (redoStroke) {
        redoStroke.handleFunc(state, redoStroke.strokes, true, state.undoStack)
    }
}

export function addStrokes(
    state: BoardState,
    strokes: Stroke[],
    isRedoable?: boolean,
    stack?: BoardAction[]
): void {
    stack = stack ?? state.undoStack ?? []
    if (isRedoable) {
        stack.push({
            strokes,
            handleFunc: deleteStrokes,
        })
    }

    strokes.forEach((s: Stroke) => {
        const page = state.pageCollection[s.pageId]
        if (page) {
            page.strokes[s.id] = s
        }
    })
}

export function deleteStrokes(
    state: BoardState,
    strokes: Stroke[],
    isRedoable?: boolean,
    stack?: BoardAction[]
): void {
    stack = stack ?? state.undoStack ?? []
    if (isRedoable) {
        stack.push({
            // reference the delete stroke for redo
            strokes: strokes.map(
                (s) => state.pageCollection[s.pageId].strokes[s.id]
            ),
            handleFunc: addStrokes,
        })
    }

    strokes.forEach(({ id, pageId }) => {
        const page = state.pageCollection[pageId]
        if (page) {
            delete page.strokes[id]
        }
    })
}

export function updateStrokes(
    state: BoardState,
    strokes: Stroke[],
    isRedoable?: boolean,
    stack?: BoardAction[]
): void {
    stack = stack ?? state.undoStack ?? []
    if (isRedoable) {
        stack?.push({
            strokes: strokes
                .map((s) => {
                    // save values of the current stroke
                    const cur = state.pageCollection[s.pageId]?.strokes[s.id]
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
            handleFunc: updateStrokes,
        })
    }

    strokes.forEach(({ id, pageId, x, y, scaleX, scaleY }) => {
        const stroke = state.pageCollection[pageId]?.strokes[id]
        stroke.update({ x, y }, { x: scaleX, y: scaleY })
    })
}
