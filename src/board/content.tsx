import React, { memo } from "react"
import { ReactReduxContextValue } from "react-redux"
import { getPageMeta } from "drawing/stroke/actions"
import { createSelector } from "reselect"
import { DEFAULT_PAGE_GAP } from "consts"
import { RootState } from "redux/store"
import { useCustomSelector } from "redux/hooks"
import { Layer } from "react-konva"
import { PageMeta } from "types"
import { LiveStrokeShape } from "./stroke/shape"
import StrokeTransformer from "./transformer"
import Page from "./page"

interface PageLayerProps {
    pageId: string
    meta: PageMeta
    y: number
}

const pageLayer = ({ pageId, meta, y }: PageLayerProps) => (
    <Layer key={pageId}>
        <Page
            pageId={pageId}
            pageSize={{
                height: meta.height,
                width: meta.width,
                x: -meta.width / 2,
                y,
            }}
        />
    </Layer>
)

// all pages and content are in this component
const Content = memo<{ value: ReactReduxContextValue }>(() => {
    // Only rerender on page change
    const pageIdSelector = createSelector(
        (state: RootState) => state.board.currentPageIndex,
        (state: RootState) => state.board.pageRank,
        (currentPageIndex, pageRank) => ({
            prevPageId: pageRank[currentPageIndex - 1],
            currPageId: pageRank[currentPageIndex],
            nextPageId: pageRank[currentPageIndex + 1],
        })
    )
    const { prevPageId, currPageId, nextPageId } =
        useCustomSelector(pageIdSelector)

    if (currPageId) {
        const currPageMeta = getPageMeta(currPageId)
        const currPageLayer = pageLayer({
            pageId: currPageId,
            meta: currPageMeta,
            y: 0,
        })

        let prevPageLayer = null
        if (prevPageId) {
            const prevPageMeta = getPageMeta(prevPageId)
            prevPageLayer = pageLayer({
                pageId: prevPageId,
                meta: prevPageMeta,
                y: -prevPageMeta.height - DEFAULT_PAGE_GAP,
            })
        }
        let nextPageLayer = null
        if (nextPageId) {
            const nextPageMeta = getPageMeta(nextPageId)
            nextPageLayer = pageLayer({
                pageId: nextPageId,
                meta: nextPageMeta,
                y: currPageMeta.height + DEFAULT_PAGE_GAP,
            })
        }
        return (
            <>
                {prevPageLayer}
                {currPageLayer}
                {nextPageLayer}
                <Layer draggable={false} listening={false}>
                    <LiveStrokeShape />
                </Layer>
                <Layer>
                    <StrokeTransformer />
                </Layer>
            </>
        )
    }
    return null
})

export default Content
