import { LiveStroke } from "drawing/stroke/types"
import React, { memo } from "react"
import { StrokeShape } from "./shape"

interface LiveStrokeShapeProps {
    liveStroke: () => LiveStroke
    liveStrokeTrigger: number
}

export const LiveStrokeShape = memo<LiveStrokeShapeProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ liveStroke, liveStrokeTrigger }) => (
        <>
            {liveStroke().pointsSegments.map((subPts: number[], i: number) => {
                const strokeSegment = {
                    ...liveStroke(),
                    points: subPts.slice(),
                } as LiveStroke
                // we can use the array index as key here
                // since the array's order is not changed
                // eslint-disable-next-line react/no-array-index-key
                return <StrokeShape key={i} stroke={strokeSegment} />
            })}
        </>
    )
)
