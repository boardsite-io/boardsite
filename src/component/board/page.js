import React from "react"
import { Group } from "react-konva"
import { useSelector } from "react-redux"
import { CANVAS_FULL_HEIGHT } from "../../constants"
import { getPageIndex, StrokeShape } from "./stroke"

export default function Page({ pageId }) {
    const strokes = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId].strokes
    )
    return (
        <Group y={getPageIndex(pageId) * CANVAS_FULL_HEIGHT}>
            {Object.keys(strokes).map((id) => (
                <StrokeShape key={id} {...strokes[id]} />
            ))}
        </Group>
    )
}
