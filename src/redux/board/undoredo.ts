import { Stroke } from "drawing/stroke/types"
import { cloneDeep } from "lodash"
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

export function updateOrAddStrokes(
    state: BoardState,
    ...strokes: Stroke[]
): void {
    strokes.forEach((stroke) => {
        const page = state.pageCollection[stroke.pageId]
        if (page) {
            if (page.strokes[stroke.id]) {
                // stroke exists -> update
                page.strokes[stroke.id].update(
                    stroke.getPosition(),
                    stroke.getScale()
                )
            } else {
                page.strokes[stroke.id] = cloneDeep(stroke)
            }
        }
    })
}
