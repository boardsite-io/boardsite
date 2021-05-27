import React from "react"
import { Group } from "react-konva"
import { KonvaEventObject } from "konva/types/Node"
import { handleDeleteStroke } from "../../drawing/handlers"
import { CANVAS_FULL_HEIGHT, toolType } from "../../constants"
import store from "../../redux/store"
import { getPageIndex } from "../../drawing/strokeactions"
import StrokeShape from "./strokeshapes"
import { useCustomSelector } from "../../redux/hooks"
import { Stroke } from "../../types"

interface PageContentProps {
    pageId: string
}

const PageContent: React.FC<PageContentProps> = ({ pageId }) => {
    const strokes = useCustomSelector(
        (state) => state.boardControl.pageCollection[pageId]?.strokes
    )

    function handleStrokeMovement(
        e: KonvaEventObject<MouseEvent | TouchEvent>
    ) {
        const { id } = e.target.attrs
        const mouseEv = e as KonvaEventObject<MouseEvent>
        // prevent to act on live stroke and hovering without clicking
        if (id === undefined || mouseEv.evt.buttons === 0) {
            return
        }
        if (store.getState().drawControl.liveStroke.type === toolType.ERASER) {
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
                {Object.keys(strokes).map((id) => (
                    <StrokeShape key={id} {...strokes[id]} pageId={pageId} />
                ))}
            </Group>
        </>
    )
}

export default PageContent
