import { BoardState, StageAttrs } from "redux/board/board.types"

export const getViewCenterY = (attrs: StageAttrs): number =>
    (attrs.height / 2 - attrs.y) / attrs.scaleY

export const getCurrentPageWidth = (state: BoardState): number | undefined => {
    const pageId = state.pageRank[state.currentPageIndex]
    return state.pageCollection[pageId]?.meta?.size.width
}
