import { Point } from "../drawing.types"
import { simplifyRDP } from "./simplify"

export const appendLinePoint = (pts: number[], newPoint: Point): void => {
    if (pts.length < 4) {
        pts.push(newPoint.x, newPoint.y)
        return
    }

    // fix the interim point to remove jitter
    const [x1, y1] = pts.slice(pts.length - 4, pts.length - 2)
    const interimPoint: Point = {
        x: x1 + (newPoint.x - x1) / 2,
        y: y1 + (newPoint.y - y1) / 2,
    }
    pts.splice(
        pts.length - 2,
        2,
        interimPoint.x,
        interimPoint.y,
        newPoint.x,
        newPoint.y
    )
}

export const newStrokeSegment = (
    pointsSegments: number[][],
    lastSegment: number[],
    scale: number,
    point: Point
): void => {
    pointsSegments[pointsSegments.length - 1] = simplifyRDP(
        lastSegment,
        0.2 / scale,
        1
    )
    // create a new subarray
    // with the last point from the previous subarray as entry
    // in order to not get a gap in the stroke
    pointsSegments.push(
        lastSegment
            .slice(lastSegment.length - 2, lastSegment.length)
            .concat([point.x, point.y])
    )
}
