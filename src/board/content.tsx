import React, { memo, useState } from "react"
import { ReactReduxContextValue } from "react-redux"
import { createSelector } from "reselect"
import { DEFAULT_PAGE_GAP } from "consts"
import { RootState } from "redux/types"
import { useCustomSelector } from "redux/hooks"
import { Layer } from "react-konva"
import { LiveStroke } from "drawing/stroke/types"
import { generateLiveStroke } from "drawing/stroke/livestroke"
import store from "redux/store"
import StrokeTransformer from "./transformer"
import Page from "./page"
import { LiveStrokeShape } from "./stroke/livestroke"

interface PageLayerProps {
    pageId: string
    relativeIndex: number
    liveStroke?: () => LiveStroke
    setLiveStrokeTrigger?: React.Dispatch<React.SetStateAction<number>>
}

const PageLayer = memo<PageLayerProps>(
    ({ pageId, relativeIndex, liveStroke, setLiveStrokeTrigger }) => {
        const { meta } = store.getState().board.pageCollection[pageId]
        return (
            <Layer key={pageId}>
                <Page
                    pageId={pageId}
                    pageSize={{
                        height: meta.height,
                        width: meta.width,
                        x: -meta.width / 2,
                        y: relativeIndex * (meta.height + DEFAULT_PAGE_GAP),
                    }}
                    liveStroke={liveStroke}
                    setLiveStrokeTrigger={setLiveStrokeTrigger}
                />
            </Layer>
        )
    }
)

// all pages and content are in this component
const Content = memo<{ value: ReactReduxContextValue }>(() => {
    const fn = generateLiveStroke()
    const [liveStroke] = useState(() => fn) // wrap the again or else useState will call it instantly??... wtf react
    const [liveStrokeTrigger, setLiveStrokeTrigger] = useState(0)

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
                            liveStroke={liveStroke}
                            setLiveStrokeTrigger={setLiveStrokeTrigger}
                        />
                    )
            )}
            <Layer draggable={false} listening={false}>
                <LiveStrokeShape
                    liveStroke={liveStroke}
                    liveStrokeTrigger={liveStrokeTrigger}
                />
            </Layer>
            <Layer>
                <StrokeTransformer />
            </Layer>
        </>
    )
})

export default Content
