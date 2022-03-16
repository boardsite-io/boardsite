import { DEFAULT_CURRENT_PAGE_INDEX } from "consts"
import { BoardState } from "./index.types"

export const getDefaultBoardState = (): BoardState => ({
    currentPageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    pageRank: [],
    pageCollection: {},
    attachments: {},
    undoStack: [],
    redoStack: [],
    strokeUpdates: [],
    transformStrokes: undefined,
    transformPagePosition: undefined,
})
