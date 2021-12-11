import { BoardStroke } from "drawing/stroke/stroke"
import { Stroke, StrokeUpdate } from "drawing/stroke/stroke.types"
import { BoardState, BoardAction } from "./board.types"

export function undoAction(state: BoardState): void {
    const action = state.undoStack?.pop()
    if (action) {
        addAction(
            action.handleFunc,
            action.undoHandleFunc,
            state,
            state.redoStack,
            true
        )
    }
}

export function redoAction(state: BoardState): void {
    const action = state.redoStack?.pop()
    if (action) {
        addAction(
            action.handleFunc,
            action.undoHandleFunc,
            state,
            state.undoStack,
            true
        )
    }
}

export function addAction(
    handler: (boardState: BoardState) => void,
    undoHandler: (boardState: BoardState) => void,
    state: BoardState,
    stack?: BoardAction[],
    isRedoable?: boolean
): void {
    if (isRedoable) {
        stack = stack ?? []
        stack?.push({
            handleFunc: undoHandler,
            undoHandleFunc: handler,
        })
    }

    handler(state)
}

export function deleteStrokes(
    state: BoardState,
    ...strokes: Stroke[] | StrokeUpdate[]
): void {
    strokes.forEach(({ id, pageId }) => {
        const page = state.pageCollection[pageId ?? ""]
        if (page && id) {
            delete page.strokes[id]
        }
    })
}

export function addOrUpdateStrokes(
    state: BoardState,
    ...strokes: Stroke[] | StrokeUpdate[]
): void {
    strokes.forEach((stroke) => {
        const page = state.pageCollection[stroke.pageId ?? ""]
        if (page && stroke.id) {
            if (page.strokes[stroke.id]) {
                // stroke exists -> update
                page.strokes[stroke.id].update(stroke)
            } else {
                page.strokes[stroke.id] = new BoardStroke(stroke as Stroke)
            }
        }
    })
}
