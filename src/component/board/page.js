import React, { memo } from "react"
import { useSelector } from "react-redux"
import { StrokeShape } from "./stroke"

export default memo(({ pageId, isDraggable }) => {
    const strokes = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId].strokes
    )

    return (
        <>
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
