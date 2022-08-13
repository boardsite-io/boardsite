import { Polygon } from "sat"
import { Serializer } from "state/types"

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

// Explicit numbers to avoid breaking save files
export enum ToolType {
    Eraser = 0,
    Pen = 1,
    Line = 2,
    Circle = 3,
    Rectangle = 4,
    Select = 5,
    Pan = 6,
    Highlighter = 7,
    Textfield = 8,
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

export type HAlign = "center" | "left" | "right"
export type VAlign = "middle" | "top" | "bottom"

export interface TextfieldAttrs {
    text: string
    color: string
    hAlign: HAlign
    vAlign: VAlign
    font: string
    fontWeight: number
    fontSize: number
    lineHeight: number
}

export interface SerializedStroke extends Tool {
    id: string
    pageId: string
    x: number
    y: number
    scaleX: number
    scaleY: number
    points: number[]
    hitboxes?: Polygon[]
    textfield?: TextfieldAttrs
}

export interface Stroke
    extends SerializedStroke,
        Serializer<Stroke, SerializedStroke> {
    isHidden: boolean

    update: (strokeUpdate: Partial<SerializedStroke>) => Stroke

    getPosition(): Point

    getScale(): Scale

    calculateHitbox: () => void
}

export type StrokeCollection = Record<string, Stroke>
export type StrokeHitbox = Record<string, Hitbox[]>
