import React, { memo, useCallback, useRef } from "react"
import { ReactReduxContextValue } from "react-redux"
import { createSelector } from "reselect"
import { DEFAULT_PAGE_GAP } from "consts"
import { RootState } from "redux/types"
import { useCustomSelector } from "hooks"
import { Layer } from "react-konva"
import type { Layer as LayerType } from "konva/lib/Layer"
import store from "redux/store"
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
    const meta = pageRankSection.map(
        (pageId) => store.getState().board.pageCollection[pageId]?.meta
    )

    const pageRef1 = useRef<LayerType>(null)
    const pageRef2 = useRef<LayerType>(null)
    const pageRef3 = useRef<LayerType>(null)
    const pageRefs = [pageRef1, pageRef2, pageRef3]

    const getPageY = useCallback(
        (i: number) => {
            if (i === 2) {
                return meta[1].size.height + DEFAULT_PAGE_GAP
            }
            return i ? 0 : -(meta[0].size.height + DEFAULT_PAGE_GAP)
        },
        [meta]
    )

    const getPageInfo = useCallback(
        (i: number): PageInfo => ({
            height: meta[i].size.height,
            width: meta[i].size.width,
            x: -meta[i].size.width / 2,
            y: getPageY(i),
        }),
        [meta, getPageY]
    )

    const isValid = useCallback(
        (i: number): boolean => !!meta[1] && !!meta[i],
        [meta]
    )

    if (!meta[1]) return null

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
