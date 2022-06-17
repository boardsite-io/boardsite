import { StrokeCollection, Tool } from "drawing/stroke/index.types"
import { PageMeta } from "state/board/state/index.types"
import { SerializedVersionState } from "state/types"

export interface DrawingState {
    tool: Tool
    pageMeta: PageMeta
    favoriteTools: Tool[]
    erasedStrokes: StrokeCollection
}

export type SerializedDrawingState = SerializedVersionState<DrawingState>
