import { BoardState } from "./board/board.types"
import { DrawingState } from "./drawing/state"
import { WebControlState } from "./session/session.types"
import { LoadingState } from "./loading/loading"

export type RootState = {
    board: BoardState
    drawing: DrawingState
    session: WebControlState
    info: LoadingState
}

export interface SerializableState {
    serialize?(): object
    deserialize?(parsed: object): object
}
