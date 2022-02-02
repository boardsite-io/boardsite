import React, { memo, useCallback, useRef } from "react"
import { ReactReduxContextValue } from "react-redux"
import { createSelector } from "reselect"
import { DEFAULT_PAGE_GAP } from "consts"
import { RootState } from "redux/types"
import { useCustomSelector } from "hooks"
import { Layer } from "react-konva"
import type { Layer as LayerType } from "konva/lib/Layer"
import store from "redux/store"
import { PageMeta } from "redux/board/index.types"
import { PageInfo } from "../Page/index.types"
import PageLayer from "../Page"
import LiveStroke from "../LiveStroke"
import StrokeTransformer from "../StrokeTransformer"

// all pages and content are in this component
const StageContent = memo<{ value: ReactReduxContextValue }>(() => {
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
    const pageMetas = pageRankSection.map(
        (pageId) => store.getState().board.pageCollection[pageId]?.meta
    )

    const pageRef1 = useRef<LayerType>(null)
    const pageRef2 = useRef<LayerType>(null)
    const pageRef3 = useRef<LayerType>(null)
    const pageRefs = [pageRef1, pageRef2, pageRef3]

    const getPageY = useCallback(
        (i: number) => {
            const prevPageHeight = pageMetas[0] as PageMeta
            const currPageHeight = pageMetas[1] as PageMeta

            // Previous Page
            if (!i) {
                return -(prevPageHeight.size.height + DEFAULT_PAGE_GAP)
            }
            // Current Page
            if (i === 1) {
                return 0
            }
            // Last Page
            return currPageHeight.size.height + DEFAULT_PAGE_GAP
        },
        [pageMetas]
    )

    const getPageInfo = useCallback(
        (i: number): PageInfo => {
            const pageMeta = pageMetas[i] as PageMeta

            return {
                height: pageMeta.size.height,
                width: pageMeta.size.width,
                x: -pageMeta.size.width / 2,
                y: getPageY(i),
            }
        },
        [pageMetas, getPageY]
    )

    const isValid = useCallback(
        (i: number): boolean => !!pageMetas[1] && !!pageMetas[i],
        [pageMetas]
    )

    if (!pageMetas[1]) {
        return null
    }

    return (
        <>
            {pageRankSection.map(
                (pageId, i) =>
                    isValid(i) && (
                        <PageLayer
                            key={pageId}
                            layerRef={pageRefs[i]}
                            pageId={pageId}
                            pageInfo={getPageInfo(i)}
                        />
                    )
            )}
            <Layer>
                {pageRankSection.map(
                    (pageId, i) =>
                        isValid(i) && (
                            <LiveStroke
                                key={pageId}
                                layerRef={pageRefs[i]}
                                pageId={pageId}
                                pageInfo={getPageInfo(i)}
                            />
                        )
                )}
            </Layer>
            <Layer>
                <StrokeTransformer />
            </Layer>
        </>
    )
})

export default StageContent
