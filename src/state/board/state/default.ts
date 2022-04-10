import { BoardState } from "./index.types"

export const getDefaultBoardState = (): BoardState => ({
    pageRank: [],
    pageCollection: {},
    attachments: {},
    undoStack: [],
    redoStack: [],
    strokeUpdates: [],
    transformStrokes: undefined,
    transformPagePosition: undefined,
})
