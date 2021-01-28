import React, { memo } from "react"
import { useSelector } from "react-redux"
import { Rect } from "react-konva"
import { StrokeShape } from "./stroke"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants"
import store from "../../redux/store"

export default memo(({ pageId, isDraggable }) => {
    const strokes = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId].strokes
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
            {Object.keys(strokes).map((id) => (
                <StrokeShape
                    key={id}
                    stroke={strokes[id]}
                    isDraggable={isDraggable}
                />
            ))}
        </>
    )
})
