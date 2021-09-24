/* eslint-disable prefer-destructuring */
import { KonvaEventObject } from "konva/types/Node"
import {
    DEFAULT_COLOR,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    MAX_LIVESTROKE_PTS,
    RDP_EPSILON,
    RDP_FORCE_SECTIONS,
} from "../../constants"
import { simplifyRDP } from "../simplify"
import { BoardStroke } from "./stroke"
import { LiveStroke, Point, Stroke, ToolType } from "./types"

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
        const p = pointsSegments[pointsSegments.length - 1]
        if (this.type === ToolType.Pen) {
            // for continuous strokes
            if (p.length < MAX_LIVESTROKE_PTS) {
                appendLinePoint(p, point)
            } else {
                pointsSegments[pointsSegments.length - 1] = simplifyRDP(
                    p,
                    0.2 / scale,
                    1
                )
                // create a new subarray
                // with the last point from the previous subarray as entry
                // in order to not get a gap in the stroke
                pointsSegments.push(
                    p.slice(p.length - 2, p.length).concat([point.x, point.y])
                )
            }
        } else {
            // only start & end points required
            pointsSegments[0] = [p[0], p[1], point.x, point.y]

            // for circle, update the initial position
            if (this.type === ToolType.Circle) {
                this.x = p[0] + (p[2] - p[0]) / 2
                this.y = p[1] + (p[3] - p[1]) / 2
            } else if (
                this.type === ToolType.Rectangle ||
                this.type === ToolType.Select
            ) {
                this.x = p[0]
                this.y = p[1]
            }
        }
        this.pointsSegments = pointsSegments
    }

    /**
     * Convert livestroke into the normal stroke format
     * @param stageScale scale for adjusting the RDP algorithm
     * @param pageIndex page index of the pageId
     */
    finalize(stageScale: number, e: KonvaEventObject<MouseEvent>): Stroke {
        this.flatPoints()
        this.processPoints(stageScale, e)
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

    processPoints(stageScale: number, e: KonvaEventObject<MouseEvent>): void {
        const { x: pageX, y: pageY } = e.target.getPosition()

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

        // compensate page offset in stage and
        // round to a reasonable precision
        this.points = this.points.map((p, i) => {
            let pt = Math.round(p * 100) / 100
            if (i % 2) {
                pt -= pageY
            } else {
                pt -= pageX
            }
            return pt
        })
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
}

const appendLinePoint = (pts: number[], newPoint: Point): void => {
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
