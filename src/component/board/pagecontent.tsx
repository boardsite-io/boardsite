import React from "react"
import { Group } from "react-konva"
import { handleDeleteStroke, handleUpdateStroke } from "../../drawing/handlers"
import { CANVAS_FULL_HEIGHT, toolType } from "../../constants"
import { store } from "../../redux/store"
import { getPageIndex } from "../../drawing/strokeactions"
import StrokeShape from "./strokeshapes"
import { useAppSelector } from "../../types"

export default function PageContent({ pageId }) {
    const strokes = useAppSelector(
        (state) => state.boardControl.pageCollection[pageId]?.strokes
    )

    const handleDragEnd = (e) => {
        const { x, y, id } = e.target.attrs
        if (store.getState().drawControl.liveStroke.type !== toolType.ERASER) {
            handleUpdateStroke({ x, y, id, pageId })
        }
    }

    function handleStrokeMovement(e) {
        const { id } = e.target.attrs
        // prevent to act on live stroke and hovering without clicking
        if (id === undefined || e.evt.buttons === 0) {
            return
        }

        if (store.getState().drawControl.liveStroke.type === toolType.ERASER) {
            handleDeleteStroke({ pageId, id })
        }
    }

    const isDraggable = useAppSelector((state) => state.drawControl.isDraggable)
    const isListening = useAppSelector((state) => state.drawControl.isListening)
    const isPanMode = useAppSelector((state) => state.drawControl.isPanMode)

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
