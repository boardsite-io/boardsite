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

export function newPoint(x: number, y: number): Point {
    return {
        x,
        y,
    }
}

export function reduceToPoints(val: Point[], cur: number, i: number): Point[] {
    // x val
    if (i % 2 === 0) {
        val.push(newPoint(cur, 0))
    } else {
        val[val.length - 1].y = cur
    }
    return val
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
    processPoints(stageScale: number, pagePosition: Point): void
    reset(): void
    selectLineCollision(strokes: StrokeMap, pagePosition: Point): StrokeMap
}

export interface StrokeMap {
    [id: string]: Stroke
}

export type StrokeShape = Stroke & ShapeConfig
