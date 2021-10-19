import { LiveStroke } from "drawing/stroke/types"
import React, { memo } from "react"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import { StrokeShape } from "./shape"

export const LiveStrokeShape = memo(() => {
    useCustomSelector((state) => state.drawing.liveStrokeUpdate) // trigger update
    const { liveStroke } = store.getState().drawing
    return (
        <>
            {liveStroke.pointsSegments.map((subPts: number[], i: number) => {
                const strokeSegment = {
                    ...liveStroke,
                    points: subPts.slice(),
                } as LiveStroke
                // we can use the array index as key here
                // since the array's order is not changed
                // eslint-disable-next-line react/no-array-index-key
                return <StrokeShape key={i} stroke={strokeSegment} />
            })}
        </>
    )
})
