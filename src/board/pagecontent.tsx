import React from "react"
import { Group } from "react-konva"
import { CANVAS_FULL_HEIGHT } from "../constants"
import store from "../redux/store"
import { getPageIndex } from "../drawing/stroke/actions"
import { StrokeShape } from "./stroke/shape"
import { useCustomSelector } from "../redux/hooks"

interface PageContentProps {
    pageId: string
}

const PageContent: React.FC<PageContentProps> = ({ pageId }) => {
    // pageId might not be valid anymore, exit then
    if (!store.getState().boardControl.pageCollection[pageId]) {
        return null
    }
    // select key of stroke map as trigger
    // stroke map comparison will only compare references
    const strokeIds = useCustomSelector((state) =>
        Object.keys(state.boardControl.pageCollection[pageId]?.strokes)
    )

    return (
        <>
            <Group
                globalCompositeOperation="source-atop"
                listening={false}
                y={getPageIndex(pageId) * CANVAS_FULL_HEIGHT}>
                {strokeIds.map((id) => (
                    <StrokeShape
                        key={id}
                        stroke={
                            store.getState().boardControl.pageCollection[pageId]
                                ?.strokes[id]
                        }
                    />
                ))}
            </Group>
        </>
    )
}

export default PageContent
