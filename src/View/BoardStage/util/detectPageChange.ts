import { DEFAULT_PAGE_GAP } from "consts"
import { NEXT_PAGE, PREV_PAGE } from "redux/board"
import { BoardState, StageAttrs } from "redux/board/index.types"
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

    const currPageHeight = pageCollection[currPageId]?.meta.size.height
    if (!currPageHeight) return false

    // Go to next page
    if (centerY > currPageHeight + DEFAULT_PAGE_GAP / 2) {
        // Check if last page
        if (currentPageIndex < pageRank.length - 1) {
            attrs.y += (currPageHeight + DEFAULT_PAGE_GAP) * attrs.scaleY

            store.dispatch(NEXT_PAGE({ attrs }))
            return true
        }
    }
    // Go to previous page
    else if (centerY < -DEFAULT_PAGE_GAP / 2) {
        // Check if first page
        if (currentPageIndex > 0) {
            const targetPageId = pageRank[state.currentPageIndex - 1]
            const targetPageHeight =
                pageCollection[targetPageId]?.meta.size.height
            if (!targetPageHeight) return false

            attrs.y -= (targetPageHeight + DEFAULT_PAGE_GAP) * attrs.scaleY

            store.dispatch(PREV_PAGE({ attrs }))
            return true
        }
    }

    return false
}
