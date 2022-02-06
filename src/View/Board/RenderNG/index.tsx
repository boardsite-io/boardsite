import { DEFAULT_PAGE_GAP } from "consts"
import { useCustomSelector } from "hooks"
import React, { Fragment, memo, useCallback } from "react"
import store from "redux/store"
import { RootState } from "redux/types"
import { createSelector } from "reselect"
import Page from "./Page"
import { PageOffset } from "./Page/index.types"

const RenderNG = memo(() => {
    const pageIdSelector = createSelector(
        (state: RootState) => state.board.currentPageIndex,
        (state: RootState) => state.board.pageRank,
        (currentPageIndex, pageRank) => [
            pageRank[currentPageIndex - 1],
            pageRank[currentPageIndex],
            pageRank[currentPageIndex + 1],
        ]
    )
    const pageRankSection = useCustomSelector(pageIdSelector)
    const pages = pageRankSection.map(
        (pageId) => store.getState().board.pageCollection[pageId]
    )

    const getPageY = useCallback(
        (i: number) => {
            if (i === 2) {
                return pages[1].meta.size.height + DEFAULT_PAGE_GAP
            }
            return i ? 0 : -(pages[0].meta.size.height + DEFAULT_PAGE_GAP)
        },
        [pages]
    )

    const getPageInfo = useCallback(
        (i: number): PageOffset => ({
            left: -pages[i].meta.size.width / 2,
            top: getPageY(i),
        }),
        [pages, getPageY]
    )

    const isValid = useCallback(
        (i: number): boolean => !!pages[1] && !!pages[i],
        [pages]
    )

    if (!pages[1]) return null

    return (
        <>
            {pageRankSection.map((pageId, i) => {
                if (!isValid(i)) return null

                const pageInfo = getPageInfo(i)
                return (
                    isValid(i) && (
                        <Page
                            key={pageId}
                            page={pages[i]}
                            pageOffset={pageInfo}
                        />
                    )
                )
            })}
        </>
    )
})

export default RenderNG
