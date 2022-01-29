import { BoardState } from "./board/index.types"
import { DrawingState } from "./drawing/state"
import { WebControlState } from "./session/index.types"
import { LoadingState } from "./loading"
import { MenuState } from "./menu"
import { NotificationState } from "./notification"

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
