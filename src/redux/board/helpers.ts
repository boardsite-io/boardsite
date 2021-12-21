import { BoardState } from "./board.types"

export const clearTransform = (state: BoardState): void => {
    state.transformStrokes = []
    state.strokeUpdates = []
}
