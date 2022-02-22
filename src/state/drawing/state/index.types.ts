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
    | "SettingsMenu" // direct draw
    | "useViewControl" // pan mode
    | "useLiveStroke" // pan mode
    | "PageContent" // erased strokes

export type DrawingSubscribers = Record<DrawingSubscriber, RenderTrigger[]>

export interface DrawingState {
    directDraw: boolean
    tool: Tool
    pageMeta: PageMeta
    favoriteTools: Tool[]
    erasedStrokes: StrokeCollection
}

export type SerializedDrawingState = DrawingState & { version?: string }
