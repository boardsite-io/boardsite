import { Page, PageRank } from "redux/board/index.types"
import store from "redux/store"

export const getVerifiedPageIds = (pageIds: PageRank): PageRank => {
    return pageIds.filter((pageId) => {
        return store.getState().board.pageCollection[pageId] !== undefined
    })
}

export const getVerifiedPages = (pageIds: PageRank): Page[] => {
    return getVerifiedPageIds(pageIds).map((pageId) => {
        return store.getState().board.pageCollection[pageId]
    }) as Page[]
}
