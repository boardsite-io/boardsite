import { BoardState } from "./index.types"

export const getDefaultBoardState = (): BoardState => ({
    pageRank: [],
    pageCollection: {},
    attachments: {},
    strokeUpdates: [],
    activeTextfield: undefined,
    transformStrokes: undefined,
    transformPagePosition: undefined,
})
