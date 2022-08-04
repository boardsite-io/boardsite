export interface ActionState {
    undoStack: Array<StackAction>
    redoStack: Array<StackAction>
}

export interface StackAction {
    handler: () => void
    undoHandler: () => void
}
