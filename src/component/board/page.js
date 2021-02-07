import React from "react"
import { Group } from "react-konva"
import { useSelector } from "react-redux"
import { CANVAS_GAP, CANVAS_HEIGHT } from "../../constants"
import { StrokeShape } from "./stroke"

export default function Page({ pageId, currentPageIndex }) {
    // console.log("Page Redraw")
    const strokes = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId].strokes
    )
    return (
        <Group y={currentPageIndex * (CANVAS_HEIGHT + CANVAS_GAP)}>
            {Object.keys(strokes).map((id) => (
                <StrokeShape key={id} {...strokes[id]} />
            ))}
        </Group>
    )
}
