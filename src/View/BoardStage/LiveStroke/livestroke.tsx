import { LiveStroke } from "drawing/livestroke/index.types"
import React, { memo } from "react"
import StrokeShape from "../StrokeShape"
import { getSegments } from "./helpers"

interface LiveStrokeShapeProps {
    liveStroke: LiveStroke
    liveStrokeTrigger: number
}

export const LiveStrokeShape = memo<LiveStrokeShapeProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ liveStroke, liveStrokeTrigger }) => {
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
                {getSegments(liveStroke).map((subPts: number[], i: number) => {
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
