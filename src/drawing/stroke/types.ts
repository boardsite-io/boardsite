import { ShapeConfig } from "konva/types/Shape"
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
}

export interface Tool {
    type: ToolType
    style: {
        color: string
        width: number
        opacity: number
    }
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

export interface Stroke extends BaseStroke {
    id: string
    scaleX: number
    scaleY: number

    serialize: () => Stroke
    update: (position: Point, scale: Scale) => void
    calculateHitbox: () => void
}

export interface LiveStroke extends BaseStroke {
    pointsSegments: number[][]

    start({ x, y }: Point, pageId: string): void
    addPoint(point: Point, scale: number): void
    flatPoints(): void
    processPoints(stageScale: number, pageIndex: number): void
    reset(): void
    selectLineCollision(strokes: StrokeMap): StrokeMap
}

export interface StrokeMap {
    [id: string]: Stroke
}

export type StrokeShape = Stroke & ShapeConfig
