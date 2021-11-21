import { KonvaEventObject } from "konva/lib/Node"
import { ShapeConfig } from "konva/lib/Shape"
import { Polygon } from "sat"

export type Hitbox = {
    v1: Point
    v2: Point
    v3: Point
    v4: Point
}

export interface StrokeHitbox {
    [id: string]: Hitbox[]
}

export type Point = {
    x: number
    y: number
}

export type Scale = {
    x: number
    y: number
}

// eslint-disable-next-line no-shadow
export enum ToolType {
    Eraser,
    Pen,
    Line,
    Triangle,
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

export interface Stroke extends BaseStroke {
    id: string
    scaleX: number
    scaleY: number

    serialize: () => Stroke
    serializeUpdate(): StrokeUpdate
    update: (strokeUpdate: Stroke | StrokeUpdate) => Stroke
    getPosition(): Point
    getScale(): Scale
    calculateHitbox: () => void
}

export interface LiveStroke extends BaseStroke {
    pointsSegments: number[][]

    setTool(tool: Tool): LiveStroke
    start({ x, y }: Point, pageId: string): void
    move(point: Point, pagePosition: Point): void
    newStrokeSegment(point: Point): void
    addPoint(point: Point): void
    register(e: KonvaEventObject<MouseEvent>): Promise<void>
    processPoints(pagePosition: Point): void
    reset(): void
    isReset(): boolean
    selectLineCollision(strokes: StrokeMap, pagePosition: Point): StrokeMap
}

export interface StrokeMap {
    [id: string]: Stroke
}

export type StrokeShape = Stroke & ShapeConfig
