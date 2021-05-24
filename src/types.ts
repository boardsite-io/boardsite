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
}

export interface Stroke extends Tool {
    id: string
    type: number
    pageId: string
    x?: number
    y?: number
    points: number[]
}

export interface Page {
    strokes: {
        [id: string]: Stroke
    }
    meta: {
        background: PageBackground
    }
}

export interface PageCollection {
    [pid: string]: Page
}

export type Point = {
    x: number
    y: number
}

export type PageBackground = "blank" | "checkered" | "ruled"
