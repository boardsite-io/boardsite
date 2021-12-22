import { LIVESTROKE_SEGMENT_SIZE } from "consts"
import { LiveStroke } from "drawing/livestroke/index.types"
import React, { memo, useCallback } from "react"
import { StrokeShape } from "../stroke/strokeShape"

interface LiveStrokeShapeProps {
    liveStroke: LiveStroke
    liveStrokeTrigger: number
}

export const LiveStrokeShape = memo<LiveStrokeShapeProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ liveStroke, liveStrokeTrigger }) => {
        const getSegments = useCallback(
            () =>
                new Array<number[]>(
                    Math.ceil(
                        liveStroke.points.length / LIVESTROKE_SEGMENT_SIZE
                    )
                )
                    .fill([])
                    .map((seg, i) =>
                        liveStroke.points.slice(
                            LIVESTROKE_SEGMENT_SIZE * i,
                            LIVESTROKE_SEGMENT_SIZE * (i + 1) + 2
                        )
                    ),
            [liveStroke]
        )

        if (liveStroke.points.length === 0) {
            return null
        }

        // Duplicate the first point for the shapes to render without warning
        if (liveStroke.points.length === 2) {
            return (
                <StrokeShape
                    stroke={{
                        ...liveStroke,
                        points: [...liveStroke.points, ...liveStroke.points],
                    }}
                />
            )
        }

        return (
            <>
                {getSegments().map((subPts: number[], i: number) => {
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
    }
)
