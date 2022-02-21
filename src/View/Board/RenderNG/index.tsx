import { DEFAULT_PAGE_GAP } from "consts"
import React, { memo, useCallback } from "react"
import { useBoard } from "state/board"
import Page from "./Page"
import { PageOffset } from "./Page/index.types"

const RenderNG = memo(() => {
    const { pageRank, currentPageIndex, pageCollection } = useBoard("RenderNG")

    // TODO: improve undefined typing
    const pages = new Array(3).fill(undefined).map((_, i) => {
        const pageId = pageRank[currentPageIndex + i - 1]
        return pageCollection[pageId]
    })

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
            {pages.map((page, i) => {
                if (!isValid(i)) return null

                const pageInfo = getPageInfo(i)
                return (
                    isValid(i) && (
                        <Page
                            key={page.pageId}
                            page={page}
                            pageOffset={pageInfo}
                        />
                    )
                )
            })}
        </>
    )
})

export default RenderNG
