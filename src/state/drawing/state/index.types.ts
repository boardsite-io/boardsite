import { StrokeCollection, Tool } from "drawing/stroke/index.types"
import { PageMeta } from "state/board/state/index.types"
import { RenderTrigger } from "state/index.types"

export type DrawingSubscriber =
    | "PageBackgroundSetting"
    | "PageSizeSetting"
    | "ActiveTool"
    | "ColorPicker"
    | "WidthPicker"
    | "ToolRing"
    | "FavoriteTools"
    | "ShapeTools"
    | "PageSizeMenu"
    | "PageStyleMenu"
    | "useViewControl" // pan mode
    | "useLiveStroke" // pan mode
    | "PageContent" // erased strokes

export type DrawingSubscribers = Record<DrawingSubscriber, RenderTrigger[]>

export interface DrawingState {
    tool: Tool
    pageMeta: PageMeta
    favoriteTools: Tool[]
    erasedStrokes: StrokeCollection
}
