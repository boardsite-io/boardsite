import { BoardState } from "./board/index.types"

export type RootState = {
    board: BoardState
}

export type FileHeader = {
    version: string
    states: SerializableReducerState[]
}

export type SerializableReducerState = "board"

export type SerializableStateRecord = Record<
    SerializableReducerState,
    SerializableState<object, object>
>

export interface SerializableState<T extends object, U extends object> {
    serialize?(): T
    deserialize?(parsed: object): Promise<U>
}
