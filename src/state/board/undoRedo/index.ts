import { BoardState, ActionConfig } from "../state/index.types"

export function undoAction(state: BoardState): void {
    const action = state.undoStack?.pop()
    if (action) {
        addAction({
            handler: action.handler,
            undoHandler: action.undoHandler,
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
            handler: action.handler,
            undoHandler: action.undoHandler,
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
            handler: cfg.undoHandler,
            undoHandler: cfg.handler,
        })
    }

    cfg.handler()
}
