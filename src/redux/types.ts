import { BoardState } from "./board/types"
import { DrawingState } from "./drawing/drawing"
import { WebControlState } from "./session/session"

export type RootState = {
    board: BoardState
    drawing: DrawingState
    session: WebControlState
}
