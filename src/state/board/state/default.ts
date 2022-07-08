import { BoardState } from "./index.types"

export const getDefaultBoardState = (): BoardState => ({
    pageRank: [],
    pageCollection: {},
    attachments: {},
    undoStack: [],
    redoStack: [],
    strokeUpdates: [],
    activeTextfield: undefined,
    transformStrokes: undefined,
    transformPagePosition: undefined,
})
