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
import { PageCollection, PageSettings } from "types"
import { pick, keys, assign, cloneDeep } from "lodash"
import { BoardPage } from "drawing/page"

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
    documentSrc: URL | string | Uint8Array
    pageSettings: PageSettings
    view: BoardView

    serialize?(): SerializedBoardState
    deserialize?(parsed: SerializedBoardState): BoardState
}

export type SerializedBoardState = BoardState & { version?: string }

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

    serialize(): SerializedBoardState {
        // clone to not mutate current state
        const stateCopy = cloneDeep<BoardState>(this)

        // dont pollute the serialized object with image data
        stateCopy.documentImages = []
        Object.keys(stateCopy.pageCollection).forEach((pageId) => {
            const { strokes } = stateCopy.pageCollection[pageId]
            Object.keys(strokes).forEach((strokeId) => {
                strokes[strokeId] = strokes[strokeId].serialize()
            })
        })

        delete stateCopy.serialize
        delete stateCopy.deserialize

        return { version: boardVersion, ...stateCopy }
    },

    deserialize(parsed: SerializedBoardState): BoardState {
        const { version } = parsed
        if (!version) {
            throw new Error("cannot deserialize state, missing version")
        }

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

        // update all valid keys
        assign(this, pick(parsed, keys(this)))

        const { pageCollection } = this
        Object.keys(pageCollection).forEach((pageId) => {
            const page = pageCollection[pageId]
            pageCollection[pageId] = new BoardPage(page)
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
