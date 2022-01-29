import { BoardState } from "./board/index.types"
import { WebControlState } from "./session/index.types"
import { LoadingState } from "./loading/index.types"
import { DrawingState } from "./drawing/index.types"
import { NotificationState } from "./notification/index.types"
import { MenuState } from "./menu/index.types"

export type RootState = {
    board: BoardState
    drawing: DrawingState
    session: WebControlState
    info: LoadingState
    menu: MenuState
    notification: NotificationState
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
