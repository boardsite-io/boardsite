import { Stroke } from "drawing/stroke/types"
import { BoardState, BoardAction } from "./state"

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

export function addStrokes(state: BoardState, ...strokes: Stroke[]): void {
    strokes.forEach((s: Stroke) => {
        const page = state.pageCollection[s.pageId]
        if (page) {
            page.strokes[s.id] = s
        }
    })
}

export function deleteStrokes(state: BoardState, ...strokes: Stroke[]): void {
    strokes.forEach(({ id, pageId }) => {
        const page = state.pageCollection[pageId]
        if (page) {
            delete page.strokes[id]
        }
    })
}

export function updateStrokes(
    state: BoardState,
    ...strokes: Stroke[]
): Stroke[] {
    return strokes
        .map(({ id, pageId, x, y, scaleX, scaleY }) => {
            const stroke = state.pageCollection[pageId]?.strokes[id]
            stroke?.update({ x, y }, { x: scaleX, y: scaleY })
            return stroke
        })
        .filter((s) => s !== undefined) as Stroke[]
}
