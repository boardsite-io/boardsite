import { DEFAULT_CURRENT_PAGE_INDEX, DEFAULT_KEEP_CENTERED } from "consts"
import { BoardState } from "./index.types"

export const getDefaultBoardState = (): BoardState => ({
    currentPageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    pageRank: [],
    pageCollection: {},
    attachments: {},
    view: {
        keepCentered: DEFAULT_KEEP_CENTERED, // TODO: Move out
    },
    undoStack: [],
    redoStack: [],
    strokeUpdates: [],
    transformStrokes: undefined,
    transformPagePosition: undefined,
})
