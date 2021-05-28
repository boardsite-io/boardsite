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
    scaleX: number
    scaleY: number
    x: number
    y: number
}

// Partial => Optional inputs from Tool
export interface Stroke extends Tool {
    id: string
    pageId: string
    scaleX: number
    scaleY: number
    points: number[]
    x: number
    y: number
}

export interface StrokeMap {
    [id: string]: Stroke
}

export type StrokeShape = Stroke & ShapeConfig

export interface PageMeta {
    background: PageBackground
}

export interface Page {
    strokes: StrokeMap
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

export type Hitbox = {
    v1: Point
    v2: Point
    v3: Point
    v4: Point
}

export interface StrokeHitbox {
    [id: string]: Hitbox[]
}

export type PageBackground = "blank" | "checkered" | "ruled"

export type LayerRefType = React.RefObject<Layer>
export type TrRefType = React.RefObject<Transformer>