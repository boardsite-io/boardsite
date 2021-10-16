import { Point, StrokeMap } from "redux/drawing/drawing.types"

export interface BoardState {
    currentPageIndex: number
    pageRank: string[]
    pageCollection: PageCollection
    document: DocumentImage[]
    documentSrc: string | Uint8Array
    pageSettings: {
        background: PageVariants
        width: number
        height: number
    }
    view: BoardView
}

export interface PageCollection {
    [pid: string]: Page
}
export interface Page {
    pageId: string
    strokes: StrokeMap
    meta: PageMeta
}
export interface PageMeta {
    background: {
        style: PageVariants
        attachId: string
        documentPageNum: number
    }
    width: number
    height: number
}
export type PageVariants = "blank" | "checkered" | "ruled" | "doc"
export type DocumentImage = HTMLImageElement

export interface BoardView {
    keepCentered: boolean
    hideNavBar: boolean
    stageWidth: number
    stageHeight: number
    stageX: number
    stageY: number
    stageScale: Point
}
