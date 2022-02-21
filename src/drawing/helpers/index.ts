import { board } from "state/board"
import { Page, PageRank } from "state/board/state/index.types"

export const getVerifiedPageIds = (pageIds: PageRank): PageRank => {
    return pageIds.filter((pageId) => {
        return board.getState().pageCollection[pageId] !== undefined
    })
}

export const getVerifiedPages = (pageIds: PageRank): Page[] => {
    return getVerifiedPageIds(pageIds).map((pageId) => {
        return board.getState().pageCollection[pageId]
    }) as Page[]
}
