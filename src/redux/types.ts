import { BoardState } from "./board/state"
import { DrawingState } from "./drawing/state"
import { LoadingState } from "./loading/loading"
import { WebControlState } from "./session/session"

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
