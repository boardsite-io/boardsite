import { Layer } from "konva/types/Layer"
import { ShapeConfig } from "konva/types/Shape"
import { Transformer } from "konva/types/shapes/Transformer"

export interface Tool {
    type: number
    style: {
        color: string
        width: number
        opacity?: number
    }
}

export interface LiveStroke extends Tool {
    id: string
    points: number[][]
    x?: number
    y?: number
}

export interface Stroke extends Tool {
    id: string
    pageId: string
    scaleX?: number
    scaleY?: number
    points: number[]
    x?: number
    y?: number
}

export interface UpdateStroke {
    x: number
    y: number
    id: string
    scaleX: number
    scaleY: number
    pageId: string
}

export type StrokeShape = Stroke & Omit<ShapeConfig, "id">

export interface PageMeta {
    background: PageBackground
}

export interface Page {
    strokes: {
        [id: string]: Stroke
    }
    meta: PageMeta
}

export interface PageCollection {
    [pid: string]: Page
}

export interface User {
    id: string
    alias: string
    color: string
}

export type Point = {
    x: number
    y: number
}

export type PageBackground = "blank" | "checkered" | "ruled"

export type LayerRefType = React.LegacyRef<Layer> | undefined
export type TrRefType = React.LegacyRef<Transformer> | undefined
