import { BoardStroke } from "drawing/stroke"
import { Stroke, StrokeUpdate } from "drawing/stroke/index.types"
import { BoardState, ActionConfig } from "./board.types"

export function undoAction(state: BoardState): void {
    const action = state.undoStack?.pop()
    if (action) {
        addAction({
            handler: action.handleFunc,
            undoHandler: action.undoHandleFunc,
            stack: state.redoStack,
            isRedoable: true,
            state,
        })
    }
}

export function redoAction(state: BoardState): void {
    const action = state.redoStack?.pop()
    if (action) {
        addAction({
            handler: action.handleFunc,
            undoHandler: action.undoHandleFunc,
            stack: state.undoStack,
            isRedoable: true,
            state,
        })
    }
}

export function addAction(cfg: ActionConfig): void {
    if (cfg.isRedoable) {
        cfg.stack = cfg.stack ?? []
        cfg.stack?.push({
            handleFunc: cfg.undoHandler,
            undoHandleFunc: cfg.handler,
        })

        if (cfg.isNew) {
            cfg.state.redoStack = []
        }
    }

    cfg.handler(cfg.state)
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
