import React from "react"
import { Group } from "react-konva"
import { useSelector } from "react-redux"
import { eraseStroke, sendStroke } from "../../api/websocket"
import { CANVAS_FULL_HEIGHT, toolType } from "../../constants"
import { UPDATE_STROKE, ERASE_STROKE } from "../../redux/slice/boardcontrol"
import store from "../../redux/store"
import { StrokeShape } from "./stroke"

export default function Page({ pageId, currentPageIndex }) {
    const strokes = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId].strokes
    )

    const handleDragEnd = (e) => {
        const { x, y, id } = e.target.attrs
        if (store.getState().drawControl.liveStroke.type !== toolType.ERASER) {
            const s = {
                x,
                y,
                id,
                pageId,
            }
            store.dispatch(UPDATE_STROKE(s))
            sendStroke(s) // ws
        }
    }

    function handleStrokeMovement(e) {
        const { id } = e.target.attrs
        // prevent to act on live stroke
        if (id === undefined) {
            return
        }

        if (
            (store.getState().drawControl.liveStroke.type === toolType.ERASER &&
                e.evt.buttons === 1) ||
            e.evt.buttons === 2
        ) {
            store.dispatch(ERASE_STROKE({ pageId, id }))
            eraseStroke({ pageId, id }) // ws
        }
    }

    const isDraggable = useSelector((state) => state.drawControl.isDraggable)
    const isListening = useSelector((state) => state.drawControl.isListening)
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)

    return (
        <Group
            globalCompositeOperation="source-atop"
            draggable={isDraggable}
            onDragEnd={handleDragEnd}
            onMouseDown={handleStrokeMovement}
            onMouseMove={handleStrokeMovement}
            onMouseEnter={handleStrokeMovement}
            listening={!isPanMode && isListening}
            y={currentPageIndex * CANVAS_FULL_HEIGHT}>
            {Object.keys(strokes).map((id) => (
                <StrokeShape key={id} {...strokes[id]} />
            ))}
        </Group>
    )
}
