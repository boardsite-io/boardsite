import { Page, PageId, PageRank } from "redux/board/index.types"
import store from "redux/store"

export const getVerifiedPageIds = (pageIds: PageRank) => {
    const unverifiedPageIds: (PageId | undefined)[] = pageIds.map((pageId) => {
        const page = store.getState().board.pageCollection[pageId]
        return page ? pageId : undefined
    })
    const verifiedPageIds = unverifiedPageIds.filter((x) => x !== undefined)

    return verifiedPageIds as PageRank
}

export const getVerifiedPages = (pageIds: PageRank) => {
    const unverifiedPages = pageIds.map((pageId) => {
        const page = store.getState().board.pageCollection[pageId]
        return page ?? undefined
    })
    const verifiedPages = unverifiedPages.filter((x) => x !== undefined)

    return verifiedPages as Page[]
}
