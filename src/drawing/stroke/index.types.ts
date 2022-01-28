import { ShapeConfig } from "konva/lib/Shape"
import { Polygon } from "sat"

export type Hitbox = {
    v1: Point
    v2: Point
    v3: Point
    v4: Point
}

export type Point = {
    x: number
    y: number
}

export type Scale = {
    x: number
    y: number
}

export enum ToolType {
    Eraser,
    Pen,
    Line,
    Circle,
    Rectangle,
    Select,
    Pan,
}

export type ToolStyle = {
    color: string
    width: number
    opacity: number
}
export interface Tool {
    type: ToolType
    latestDrawType?: ToolType
    style: ToolStyle
}

export interface BaseStroke extends Tool {
    id?: string
    pageId: string
    x: number
    y: number
    scaleX?: number
    scaleY?: number
    points: number[]
    hitboxes?: Polygon[]
}

export interface StrokeUpdate {
    id?: string
    pageId?: string
    x?: number
    y?: number
    scaleX?: number
    scaleY?: number
}

export interface SerializedStroke extends BaseStroke {
    id: string
    scaleX: number
    scaleY: number
}

export interface Stroke extends SerializedStroke {
    serialize: () => Stroke
    serializeUpdate(): StrokeUpdate
    update: (strokeUpdate: Stroke | StrokeUpdate) => Stroke
    getPosition(): Point
    getScale(): Scale
    calculateHitbox: () => void
}

export type StrokeMap = Record<string, Stroke>
export type StrokeHitbox = Record<string, Hitbox[]>
export type StrokeShape = Stroke & ShapeConfig
