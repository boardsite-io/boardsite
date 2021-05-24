import React from "react"
import { Group } from "react-konva"
import { KonvaEventObject } from "konva/types/Node"
import { handleDeleteStroke, handleUpdateStroke } from "../../drawing/handlers"
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

    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
        const { x, y, id } = e.target.attrs
        if (store.getState().drawControl.liveStroke.type !== toolType.ERASER) {
            handleUpdateStroke({ x, y, id, pageId } as Stroke)
        }
    }

    function handleStrokeMovement(e: any) {
        const { id } = e.target.attrs
        // prevent to act on live stroke and hovering without clicking
        if (id === undefined || e.evt.buttons === 0) {
            return
        }
        if (store.getState().drawControl.liveStroke.type === toolType.ERASER) {
            handleDeleteStroke({ pageId, id })
        }
    }

    const isDraggable = useCustomSelector(
        (state) => state.drawControl.isDraggable
    )
    const isListening = useCustomSelector(
        (state) => state.drawControl.isListening
    )
    const isPanMode = useCustomSelector((state) => state.drawControl.isPanMode)

    return (
        <Group
            globalCompositeOperation="source-atop"
            draggable={isDraggable}
            onDragEnd={handleDragEnd}
            onMouseDown={handleStrokeMovement}
            onMouseMove={handleStrokeMovement}
            onMouseEnter={handleStrokeMovement}
            onTouchStart={handleStrokeMovement}
            onTouchMove={handleStrokeMovement}
            listening={!isPanMode && isListening}
            y={getPageIndex(pageId) * CANVAS_FULL_HEIGHT}>
            {Object.keys(strokes).map((id) => (
                <StrokeShape key={id} {...strokes[id]} />
            ))}
        </Group>
    )
}

export default PageContent
