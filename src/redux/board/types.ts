import { Point } from "drawing/stroke/types"
import { DocumentImage, PageBackground, PageCollection } from "types"
import {
    DEFAULT_CURRENT_PAGE_INDEX,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    DEFAULT_STAGE_SCALE,
    DEFAULT_KEEP_CENTERED,
    DEFAULT_HIDE_NAVBAR,
    pageType,
    pageSize,
    sizePreset,
} from "consts"

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
        size: { width: number; height: number }
    }
    view: BoardView
}

export const initState: BoardState = {
    currentPageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    pageRank: [],
    pageCollection: {},
    document: [],
    documentSrc: "",
    pageSettings: {
        background: pageType.BLANK, // default,
        size: pageSize[sizePreset.A4_LANDSCAPE],
    },
    view: {
        keepCentered: DEFAULT_KEEP_CENTERED,
        hideNavBar: DEFAULT_HIDE_NAVBAR,
        stageWidth: window.innerWidth,
        stageHeight: window.innerHeight,
        stageX: DEFAULT_STAGE_X,
        stageY: DEFAULT_STAGE_Y,
        stageScale: DEFAULT_STAGE_SCALE,
    },
}
