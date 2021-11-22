import {
    DEFAULT_CURRENT_PAGE_INDEX,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    DEFAULT_STAGE_SCALE,
    DEFAULT_KEEP_CENTERED,
    DEFAULT_HIDE_NAVBAR,
    pageSize,
    backgroundStyle,
} from "consts"
import { BoardStroke } from "drawing/stroke/stroke"
import { pick, keys, assign, cloneDeep } from "lodash"
import { BoardPage } from "drawing/page"
import { BoardState, SerializedBoardState } from "./board.types"

// version of the board state reducer to allow backward compatibility for stored data
//
// [1.0] - 2021-10-22 - Added versioning
export const boardVersion = "1.0"

export const newState = (state?: BoardState): BoardState => ({
    currentPageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    pageRank: [],
    pageCollection: {},
    documentImages: [],
    documentSrc: "",
    pageSettings: {
        background: backgroundStyle.BLANK, // default,
        size: pageSize.a4landscape,
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
    undoStack: [],
    redoStack: [],
    strokeUpdates: [],
    transformStrokes: undefined,
    transformPagePosition: undefined,
    renderTrigger: 0,

    triggerManualUpdate(): void {
        this.renderTrigger = (this.renderTrigger ?? 0) + 1
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

        delete stateCopy.triggerManualUpdate
        delete stateCopy.serialize
        delete stateCopy.deserialize

        // dont save undo redo actions and transform layer
        delete stateCopy.undoStack
        delete stateCopy.redoStack

        delete stateCopy.strokeUpdates
        delete stateCopy.transformStrokes
        delete stateCopy.transformPagePosition

        delete stateCopy.renderTrigger

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

        // Update stage dimensions for initial indexedDB data load on new window
        this.view.stageHeight = window.innerHeight
        this.view.stageWidth = window.innerWidth

        return this
    },

    ...state,
})
