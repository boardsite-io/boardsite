import { pageSize } from "consts"
import { BoardState, StageAttrs } from "redux/board/index.types"

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

export const getPageHeight = (
    state: BoardState,
    indexOffset: number
): number | undefined => {
    const targetPageId = state.pageRank[state.currentPageIndex + indexOffset]

    return state.pageCollection[targetPageId]?.meta?.size.height
}

export const onFirstPage = (state: BoardState): boolean => {
    return state.currentPageIndex === 0
}

export const onLastPage = (state: BoardState): boolean => {
    return state.currentPageIndex === state.pageRank.length - 1
}
