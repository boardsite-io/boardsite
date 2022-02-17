import { StrokeCollection, Tool } from "drawing/stroke/index.types"
import { PageMeta } from "redux/board/index.types"
import { Subscribers } from "state/index.types"

export interface DrawingState {
    directDraw: boolean
    tool: Tool
    pageMeta: PageMeta
    favoriteTools: Tool[]
    erasedStrokes: StrokeCollection
}

export type SerializedDrawingState = DrawingState & { version?: string }

export type DrawingSubscription =
    | "directDraw"
    | "toolStyle"
    | "toolType"
    | "favoriteTools"
    | "pageSize"
    | "pageStyle"

export type DrawingSubscribers = Record<DrawingSubscription, Subscribers>
