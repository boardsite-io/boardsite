import { DEFAULT_PAGE_GAP } from "consts"
import { JUMP_TO_NEXT_PAGE, JUMP_TO_PREV_PAGE } from "redux/board/board"
import { BoardState, StageAttrs } from "redux/board/board.types"
import store from "redux/store"
import { getViewCenterY } from "./helpers"

export const detectPageChange = (
    state: BoardState,
    attrs: StageAttrs
): boolean => {
    const { pageRank, pageCollection, currentPageIndex } = state

    const centerY = getViewCenterY(attrs)
    const currPageId = pageRank[state.currentPageIndex]
    if (!currPageId) return false

    const currPageHeight = pageCollection[currPageId]?.meta.height
    if (!currPageHeight) return false

    // Go to next page
    if (centerY > currPageHeight + DEFAULT_PAGE_GAP / 2) {
        // Check if last page
        if (currentPageIndex < pageRank.length - 1) {
            attrs.y += (currPageHeight + DEFAULT_PAGE_GAP) * attrs.scaleY

            store.dispatch(JUMP_TO_NEXT_PAGE(false))
            return true
        }
    }
    // Go to previous page
    else if (centerY < -DEFAULT_PAGE_GAP / 2) {
        // Check if first page
        if (currentPageIndex > 0) {
            const targetPageId = pageRank[state.currentPageIndex - 1]
            const targetPageHeight = pageCollection[targetPageId]?.meta.height
            if (!targetPageHeight) return false

            attrs.y -= (targetPageHeight + DEFAULT_PAGE_GAP) * attrs.scaleY

            store.dispatch(JUMP_TO_PREV_PAGE(false))
            return true
        }
    }

    return false
}
