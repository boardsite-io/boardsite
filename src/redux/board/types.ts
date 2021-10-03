import { Point } from "drawing/stroke/types"
import { DocumentImage, PageBackground, PageCollection } from "types"

export interface BoardView {
    keepCentered: boolean
    hideNavBar: boolean
    stageWidth: number
    stageHeight: number
    stageX: number
    stageY: number
    stageScale: Point
}

export interface BoardState {
    currentPageIndex: number
    pageRank: string[]
    pageCollection: PageCollection
    document: DocumentImage[]
    documentSrc: string | Uint8Array
    pageSettings: {
        background: PageBackground // default,
        width: number
        height: number
    }
    view: BoardView
}
