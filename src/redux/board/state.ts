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
import { BoardStroke } from "drawing/stroke/stroke"
import { Point } from "drawing/stroke/types"
import { PageBackground, PageCollection } from "types"

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
    documentImages: string[]
    documentSrc: string | Uint8Array
    pageSettings: {
        background: PageBackground // default,
        size: { width: number; height: number }
    }
    view: BoardView

    serialize?(): string
    deserialize?(state: string): BoardState
}

export const newState = (state?: BoardState): BoardState => ({
    currentPageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    pageRank: [],
    pageCollection: {},
    documentImages: [],
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

    serialize(): string {
        const stateCopy = { ...this }
        const { pageCollection } = stateCopy
        Object.keys(pageCollection).forEach((pageId) => {
            const strokes = { ...pageCollection[pageId].strokes }
            Object.keys(strokes).forEach((strokeId) => {
                strokes[strokeId] = strokes[strokeId].serialize()
            })
        })
        return JSON.stringify(stateCopy)
    },

    deserialize(stateStr: string): BoardState {
        Object.assign(this, JSON.parse(stateStr))
        const { pageCollection } = this
        Object.keys(pageCollection).forEach((pageId) => {
            const { strokes } = pageCollection[pageId]
            Object.keys(strokes).forEach((strokeId) => {
                const stroke = strokes[strokeId]
                strokes[strokeId] = new BoardStroke(stroke) // deserialize a new instance
            })
        })
        return this
    },

    ...state,
})
