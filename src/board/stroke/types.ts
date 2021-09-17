import { ShapeConfig } from "konva/types/Shape"
import { Polygon } from "sat"

export type Point = {
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

export interface Stroke extends Tool {
    id: string
    pageId: string
    x: number
    y: number
    scaleX: number
    scaleY: number
    points: number[]
    hitboxes?: Polygon[]
}

export interface BoardStrokeType extends Stroke {
    serialize?: () => Stroke
    update?: ({ x, y, scaleX, scaleY }: Stroke) => void
    calculateHitbox?: () => void
}

export interface BoardLiveStrokeType extends Stroke {
    pointsSegments: number[][]

    start({ x, y }: Point, pageId: string): void
    addPoint(point: Point, scale: number): void
    flatPoints(): void
    processPoints(stageScale: number, pageIndex: number): void
    reset(): void
}

export type StrokeShape = Stroke & ShapeConfig