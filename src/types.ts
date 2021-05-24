export interface Tool {
    type: number
    style: {
        color: string
        width: number
        opacity?: number
    }
}

export interface LiveStroke extends Tool {
    points: number[][]
    x: number
    y: number
}

export interface Stroke extends Tool {
    id: string
    type: number
    pageId: string
    x?: number
    y?: number
    scaleX?: number
    scaleY?: number
    points: number[]
}

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
