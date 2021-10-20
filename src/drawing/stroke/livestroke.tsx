/* eslint-disable prefer-destructuring */
import {
    DEFAULT_COLOR,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    ERASER_WIDTH,
    MAX_LIVESTROKE_PTS,
    RDP_EPSILON,
    RDP_EPSILON_LIVESTROKE,
    RDP_FORCE_SECTIONS,
} from "consts"
import { perpendicularDistance, simplifyRDP } from "../simplify"
import { getHitboxPolygon, matchStrokeCollision } from "./hitbox"
import { BoardStroke } from "./stroke"
import {
    LiveStroke,
    Point,
    reduceToPoints,
    Stroke,
    StrokeMap,
    ToolType,
} from "./types"

export class BoardLiveStroke implements LiveStroke {
    type = DEFAULT_TOOL as ToolType
    style = {
        color: DEFAULT_COLOR as string,
        width: DEFAULT_WIDTH as number,
        opacity: 1 as number,
    }
    pageId = ""
    x = 0
    y = 0
    points = [] as number[]
    pointsSegments = [] as number[][]

    start({ x, y }: Point, pageId: string): void {
        this.reset()
        this.pageId = pageId
        this.pointsSegments = [[x, y]]
    }

    addPoint(point: Point, scale: number): void {
        const { pointsSegments } = this
        const lastSegment = pointsSegments[pointsSegments.length - 1]

        switch (this.type) {
            case ToolType.Pen:
            case ToolType.Eraser:
                // for continuous strokes
                if (lastSegment.length < MAX_LIVESTROKE_PTS) {
                    appendLinePoint(lastSegment, point, scale)
                } else {
                    newStrokeSegment(pointsSegments, lastSegment, scale, point)
                }
                this.pointsSegments = pointsSegments
                return
            case ToolType.Circle:
                this.x = lastSegment[0] + (point.x - lastSegment[0]) / 2
                this.y = lastSegment[1] + (point.y - lastSegment[1]) / 2
                break
            case ToolType.Rectangle:
            case ToolType.Select:
                this.x = lastSegment[0]
                this.y = lastSegment[1]
                break
            default:
                break
        }

        // only start & end point required for non continuous
        this.pointsSegments = [
            [lastSegment[0], lastSegment[1], point.x, point.y],
        ]
    }

    /**
     * Convert livestroke into the normal stroke format
     * @param stageScale scale for adjusting the RDP algorithm
     * @param pageIndex page index of the pageId
     */
    finalize(stageScale: number, pagePosition: Point): Stroke {
        this.flatPoints()
        this.processPoints(stageScale, pagePosition)
        const stroke = new BoardStroke(this)
        this.reset()
        return stroke
    }

    flatPoints(): void {
        const segments = this.pointsSegments
        if (segments.length === 0) {
            this.points = []
        } else if (segments.length === 1) {
            this.points = segments[0]
        } else {
            let pts: number[] = []
            for (let i = 0; i < segments.length - 1; i += 1) {
                pts = pts.concat(segments[i].slice(0, segments[i].length - 2))
            }
            this.points = pts.concat(segments[segments.length - 1])
        }
    }

    processPoints(stageScale: number, pagePosition: Point): void {
        const { x: pageX, y: pageY } = pagePosition

        switch (this.type) {
            case ToolType.Pen:
                // simplify the points
                this.points = simplifyRDP(
                    this.points,
                    RDP_EPSILON / stageScale,
                    RDP_FORCE_SECTIONS + 1
                )
                break
            case ToolType.Rectangle:
            case ToolType.Circle:
                this.x -= pageX
                this.y -= pageY
                break
            default:
                break
        }

        // compensate page offset in stage
        this.points = subPageOffset(this.points, pagePosition)
    }

    /**
     * Reset after completion
     * x, y, scaleX, scaleY : constants so no need to reset
     * Tool should persist so don't reset either
     */
    reset(): void {
        this.pageId = ""
        this.x = 0
        this.y = 0
        this.points = []
        this.pointsSegments = []
    }

    private numUpdates = 0
    selectLineCollision(strokes: StrokeMap, pagePosition: Point): StrokeMap {
        const target = 5
        const res: StrokeMap = {}
        this.numUpdates += 1
        if (this.numUpdates === target) {
            const p = this.pointsSegments[this.pointsSegments.length - 1]
            // create a line between the latest point and 5th last point
            const minIndex = Math.max(p.length - 2 - 2 * target, 0)
            const line = p
                .slice(minIndex, minIndex + 2)
                .concat(p.slice(p.length - 2))

            this.numUpdates = 0
            const sel = getHitboxPolygon(
                subPageOffset(line, pagePosition), // compensate page offset in stage
                ERASER_WIDTH
            )

            return matchStrokeCollision(strokes, sel)
        }
        return res
    }
}

const appendLinePoint = (pts: number[], pEnd: Point, scale: number): void => {
    if (pts.length < 4) {
        pts.push(pEnd.x, pEnd.y)
        return
    }

    // fix the interim point to remove jitter
    const [pMid] = pts
        .slice(pts.length - 2, pts.length)
        .reduce(reduceToPoints, [] as Point[])
    const [pStart] = pts
        .slice(pts.length - 4, pts.length - 2)
        .reduce(reduceToPoints, [] as Point[])

    const threshold = 1
    if (perpendicularDistance(pMid, [pStart, pEnd]) > threshold / scale) {
        // for points that deviate more than the threshold eg. intentional peaks in the line should be kept
        pts.push(pEnd.x, pEnd.y)
    } else {
        // patch the middle point
        // deviations below the threshold can be considered `noise` and normalized
        const pInterim: Point = {
            x: pStart.x + (pEnd.x - pStart.x) / 2,
            y: pStart.y + (pEnd.y - pStart.y) / 2,
        }
        pts.splice(pts.length - 2, 2, pInterim.x, pInterim.y, pEnd.x, pEnd.y)
    }
}

const newStrokeSegment = (
    pointsSegments: number[][],
    lastSegment: number[],
    scale: number,
    point: Point
) => {
    pointsSegments[pointsSegments.length - 1] = simplifyRDP(
        lastSegment,
        RDP_EPSILON_LIVESTROKE / scale,
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

const subPageOffset = (points: number[], pagePosition: Point): number[] =>
    points.map((p, i) => {
        let pt = Math.round(p * 100) / 100 // round to a reasonable precision
        if (i % 2) {
            pt -= pagePosition.y
        } else {
            pt -= pagePosition.x
        }
        return pt
    })
