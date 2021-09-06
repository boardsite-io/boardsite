import React from "react"
import { Group } from "react-konva"
import { KonvaEventObject } from "konva/types/Node"
import { handleDeleteStroke } from "../drawing/handlers"
import { CANVAS_FULL_HEIGHT } from "../constants"
import store from "../redux/store"
import { getPageIndex } from "../drawing/strokeactions"
import { StrokeShape } from "./stroke/shape"
import { useCustomSelector } from "../redux/hooks"
import { Stroke, ToolType } from "../types"

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

    const handleStrokeMovement = (
        e: KonvaEventObject<MouseEvent | TouchEvent>
    ) => {
        const { id } = e.target.attrs
        const mouseEv = e as KonvaEventObject<MouseEvent>
        // prevent to act on live stroke and hovering without clicking
        if (id === undefined || mouseEv.evt.buttons === 0) {
            return
        }
        if (store.getState().drawControl.liveStroke.type === ToolType.Eraser) {
            handleDeleteStroke({ pageId, id } as Stroke)
        }
    }

    const isListening = useCustomSelector(
        (state) => state.drawControl.isListening
    )
    const isPanMode = useCustomSelector((state) => state.drawControl.isPanMode)

    return (
        <>
            <Group
                globalCompositeOperation="source-atop"
                onMouseDown={handleStrokeMovement}
                onMouseMove={handleStrokeMovement}
                onMouseEnter={handleStrokeMovement}
                onTouchStart={handleStrokeMovement}
                onTouchMove={handleStrokeMovement}
                listening={!isPanMode && isListening}
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
