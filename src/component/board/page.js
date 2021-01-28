import React from "react"
import { useSelector } from "react-redux"
import { Rect } from "react-konva"
import { StrokeShape } from "./stroke"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants"
import store from "../../redux/store"

export default function Page({ pageId, isDraggable }) {
    const strokes = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId]
    )

    return (
        <>
            <Rect
                height={CANVAS_HEIGHT}
                width={CANVAS_WIDTH}
                x={0}
                y={
                    CANVAS_HEIGHT *
                    store
                        .getState()
                        .boardControl.present.pageRank.indexOf(pageId)
                }
                stroke="#0f0"
                strokeWidth={5}
                fill="#eee"
            />
            {strokes.map((stroke) => (
                <StrokeShape
                    key={stroke.id}
                    stroke={stroke}
                    isDraggable={isDraggable}
                />
            ))}
        </>
    )
}
