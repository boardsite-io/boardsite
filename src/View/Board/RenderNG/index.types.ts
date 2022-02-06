import { ToolType } from "drawing/stroke/index.types"

export type StrokeStyle = {
    color: string
    width: number
    opacity: number
}

export type StrokeId = string
export type StrokePageId = string

export interface RenderStroke {
    id: StrokeId
    pageId: StrokePageId
    type: ToolType
    style: StrokeStyle
    x: number
    y: number
    scaleX?: number
    scaleY?: number
    points: number[]
}
