import React from "react"
import { Group } from "react-konva"
import { useSelector } from "react-redux"
import { CANVAS_FULL_HEIGHT } from "../../constants"
import { StrokeShape } from "./stroke"

export default function Page({ pageId, currentPageIndex }) {
    const strokes = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId].strokes
    )

    const isDraggable = useSelector((state) => state.drawControl.isDraggable)
    const isListening = useSelector((state) => state.drawControl.isListening)
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)

    return (
        <Group
            globalCompositeOperation="source-atop"
            draggable={isDraggable}
            listening={!isPanMode && isListening}
            y={currentPageIndex * CANVAS_FULL_HEIGHT}>
            {Object.keys(strokes).map((id) => (
                <StrokeShape key={id} {...strokes[id]} />
            ))}
        </Group>
    )
}
