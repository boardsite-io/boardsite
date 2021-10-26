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
import { cloneDeep } from "lodash"

// version of the board state reducer to allow backward compatibility for stored data
//
// [1.0] - 2021-10-22 - Added versioning
export const boardVersion = "1.0"

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
        // clone to not mutate current state
        const stateCopy = cloneDeep<BoardState>(this)
        Object.keys(stateCopy.pageCollection).forEach((pageId) => {
            const { strokes } = stateCopy.pageCollection[pageId]
            Object.keys(strokes).forEach((strokeId) => {
                strokes[strokeId] = strokes[strokeId].serialize()
            })
        })
        return JSON.stringify({ version: boardVersion, ...stateCopy })
    },

    deserialize(stateStr: string): BoardState {
        const parsed = JSON.parse(stateStr)
        const { version } = parsed
        if (!version) {
            throw new Error("cannot deserialize state, missing version")
        }
        delete parsed.version

        switch (version) {
            case boardVersion:
                // latest version; no preprocessing required
                break

            // E.g.
            // case "0.9":
            // parsed = parseV0_9(parsed)
            // break

            default:
                throw new Error(
                    `cannot deserialize state, unkown version ${version}`
                )
        }

        Object.assign(this, parsed)
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