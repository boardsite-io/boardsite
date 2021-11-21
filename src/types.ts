import { Stroke, StrokeMap } from "drawing/stroke/types"

// eslint-disable-next-line no-shadow
export enum Variants {
    Primary = "PRIMARY",
    Secondary = "SECONDARY",
}

export interface PageSettings {
    background: PageBackground // default,
    size: { width: number; height: number }
}

export interface Page {
    pageId: string
    strokes: StrokeMap
    meta: PageMeta

    setID: (pageId: string) => Page
    clear: () => void
    updateMeta: (meta: PageMeta) => Page
}

export interface PageCollection {
    [pid: string]: Page
}

export type PageBackground = "blank" | "checkered" | "ruled" | "doc"

export interface PageSize {
    width: number
    height: number
}
export interface PageMeta extends PageSize {
    background: {
        style: PageBackground
        attachURL: URL | string
        documentPageNum: number
    }
}

export type TransformStrokes = Stroke[]
