import { StrokeCollection, Tool } from "drawing/stroke/index.types"
import { PageBackgroundStyle, PageMeta, PageSize } from "../board/index.types"

export interface DrawingState {
    isDraggable: boolean
    directDraw: boolean
    tool: Tool
    pageMeta: PageMeta
    favoriteTools: Tool[]
    erasedStrokes: StrokeCollection

    serialize?(): SerializedDrawingState
    deserialize?(parsed: SerializedDrawingState): Promise<DrawingState>
}

export type SetPageBackground = PageBackgroundStyle
export type SetPageSize = PageSize

export type SerializedDrawingState = DrawingState & { version?: string }
