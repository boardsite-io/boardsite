import { ShapeConfig } from "konva/types/Shape"
import { Polygon } from "sat"

export type Point = {
    x: number
    y: number
}

export interface Tool {
    type: number
    style: {
        color: string
        width: number
        opacity?: number
    }
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

export interface LiveStroke extends Tool {
    pointsSegments: number[][]
    x?: number
    y?: number

    updatePoints?: (point: Point, scale: number, sample: number) => void
    flatPoints?: () => number[]
    getShape?: (shapeProps: ShapeConfig) => JSX.Element
}

export type StrokeShape = Stroke & ShapeConfig

// Partial => Optional inputs from Tool
export interface Stroke extends Tool {
    id: string
    pageId: string
    scaleX?: number
    scaleY?: number
    points: number[]
    x?: number
    y?: number

    hitboxes?: Polygon[]

    serialize?: () => Stroke
    processPoints?: () => void
    update?: ({ x, y, scaleX, scaleY }: Stroke) => void
    getShape?: (shapeProps: ShapeConfig) => JSX.Element
    calculateHitbox?: () => void
}
