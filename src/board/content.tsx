import React, { memo, useEffect, useRef } from "react"
import { ReactReduxContextValue } from "react-redux"
import { getPageMeta } from "drawing/stroke/actions"
import { createSelector } from "reselect"
import { DEFAULT_PAGE_GAP, DOC_SCALE } from "consts"
import { RootState } from "redux/types"
import { useCustomSelector } from "redux/hooks"
import { Layer } from "react-konva"
import { Layer as LayerType } from "konva/lib/Layer"
import StrokeTransformer from "./transformer"
import Page from "./page"
import { LiveStrokeShape } from "./stroke/livestroke"

interface PageLayerProps {
    pageId: string
    relativeIndex: number
}

const PageLayer = ({ pageId, relativeIndex }: PageLayerProps) => {
    const ref = useRef<LayerType>(null)
    const meta = getPageMeta(pageId)

    useEffect(() => {
        // cache the layer/page by default
        ref.current?.cache({ pixelRatio: DOC_SCALE })
    })

    return (
        <Layer key={pageId} ref={ref}>
            <Page
                pageId={pageId}
                pageSize={{
                    height: meta.height,
                    width: meta.width,
                    x: -meta.width / 2,
                    y: relativeIndex * (meta.height + DEFAULT_PAGE_GAP),
                }}
            />
        </Layer>
    )
}

// all pages and content are in this component
const Content = memo<{ value: ReactReduxContextValue }>(() => {
    // Only rerender on page change
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

    return (
        <>
            {pageRankSection.map(
                (pageId, index) =>
                    pageId && (
                        <PageLayer
                            key={pageId}
                            pageId={pageId}
                            relativeIndex={index - 1}
                        />
                    )
            )}
            <Layer draggable={false} listening={false}>
                <LiveStrokeShape />
            </Layer>
            <Layer>
                <StrokeTransformer />
            </Layer>
        </>
    )
})

export default Content
