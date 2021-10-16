import { ShapeConfig } from "konva/types/Shape"
import { Polygon } from "sat"
import { Transformer } from "konva/types/shapes/Transformer"
import { Node, NodeConfig } from "konva/types/Node"

export type TrRefType = React.RefObject<Transformer>
export type TrNodesType = Node<NodeConfig>[]
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

export interface LiveStroke extends Stroke {
    pointsSegments: number[][]
}

export interface StrokeMap {
    [id: string]: Stroke
}

export type StrokeShape = Stroke & ShapeConfig

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

export interface Tool {
    type: ToolType
    style: {
        color: string
        width: number
        opacity: number
    }
}
