import { pageSize } from "consts"
import { BoardState, StageAttrs } from "redux/board/board.types"

export const getViewCenterY = (attrs: StageAttrs): number =>
    (attrs.height / 2 - attrs.y) / attrs.scaleY

export const getCurrentPageWidth = (state: BoardState): number => {
    const pageId = state.pageRank[state.currentPageIndex]

    return (
        state.pageCollection[pageId]?.meta?.size.width ??
        pageSize.a4landscape.width
    )
}

export const getCenterX = (): number => window.innerWidth / 2
export const getCenterY = (): number => window.innerHeight / 2
