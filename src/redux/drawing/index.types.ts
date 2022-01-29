import { StrokeMap, Tool } from "drawing/stroke/index.types"

export interface DrawingState {
    isDraggable: boolean
    directDraw: boolean
    tool: Tool
    favoriteTools: Tool[]
    erasedStrokes: StrokeMap

    serialize?(): SerializedDrawingState
    deserialize?(parsed: SerializedDrawingState): Promise<DrawingState>
}

export type SerializedDrawingState = DrawingState & { version?: string }
