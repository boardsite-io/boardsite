import { BoardState } from "./board/index.types"
import { DrawingState } from "./drawing/index.types"

export type RootState = {
    board: BoardState
    drawing: DrawingState
}

export type FileHeader = {
    version: string
    states: SerializableReducerState[]
}

export type SerializableReducerState = "board" | "drawing"

export type SerializableStateRecord = Record<
    SerializableReducerState,
    SerializableState<object, object>
>

export interface SerializableState<T extends object, U extends object> {
    serialize?(): T
    deserialize?(parsed: object): Promise<U>
}
