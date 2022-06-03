import { ToolType } from "drawing/stroke/index.types"

export const isDrawType = (type: ToolType): boolean =>
    type === ToolType.Pen ||
    type === ToolType.Highlighter ||
    type === ToolType.Line ||
    type === ToolType.Rectangle ||
    type === ToolType.Circle
