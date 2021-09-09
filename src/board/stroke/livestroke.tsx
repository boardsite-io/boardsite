import React from "react"
import { Ellipse, Line, Rect } from "react-konva"
import { ShapeConfig } from "konva/types/Shape"
import {
    CANVAS_PIXEL_RATIO,
    DEFAULT_COLOR,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    LIVESTROKE_PTS_OVERLAP,
    MAX_LIVESTROKE_PTS,
    SEL_FILL,
    SEL_FILL_ENABLED,
    SEL_STROKE,
    SEL_STROKE_ENABLED,
} from "../../constants"
import { Point, ToolType, Tool } from "../../types"
import { simplifyRDP } from "../../drawing/simplify"

export class BoardLiveStroke implements Tool {
    constructor() {
        this.type = DEFAULT_TOOL
        this.style = {
            color: DEFAULT_COLOR,
            width: DEFAULT_WIDTH * CANVAS_PIXEL_RATIO,
            opacity: 1,
        }
        this.points = []
        this.pointsSegments = []
        this.x = 0
        this.y = 0
    }
    type: ToolType
    points: number[]
    pointsSegments?: number[][]
    x: number
    y: number

    style: {
        color: string
        width: number
        opacity?: number
    }

    updatePoints(point: Point, scale: number): number[][] {
        const pointsSegments = this.pointsSegments ?? []
        const p = pointsSegments[pointsSegments.length - 1]
        if (isContinuous(this.type)) {
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
                    p
                        .slice(p.length - LIVESTROKE_PTS_OVERLAP * 2, p.length)
                        .concat([point.x, point.y])
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
                // eslint-disable-next-line prefer-destructuring
                this.x = p[0]
                // eslint-disable-next-line prefer-destructuring
                this.y = p[1]
            }
        }
        return pointsSegments
    }

    flatPoints(): number[] {
        const pointsSegments = this.pointsSegments ?? []
        if (pointsSegments.length === 0) {
            return []
        }
        if (pointsSegments.length === 1) {
            return pointsSegments[0]
        }
        let pts: number[] = []
        for (let i = 0; i < pointsSegments.length - 1; i += 1) {
            pts = pts.concat(
                pointsSegments[i].slice(
                    0,
                    pointsSegments[i].length - 2 * LIVESTROKE_PTS_OVERLAP
                )
            )
        }
        pts = pts.concat(pointsSegments[pointsSegments.length - 1])
        return pts
    }

    getShape(shapeProps: ShapeConfig): JSX.Element {
        const { points } = shapeProps
        switch (this.type) {
            case ToolType.Pen: {
                // console.log("shapeLine", shapeProps)
                return <Line points={points} tension={0.35} {...shapeProps} />
            }
            case ToolType.Line:
                return <Line points={points} tension={0.35} {...shapeProps} />
            case ToolType.Circle:
                return (
                    <Ellipse
                        radiusX={Math.abs((points[2] - points[0]) / 2)}
                        radiusY={Math.abs((points[3] - points[1]) / 2)}
                        fillEnabled={false} // Remove inner hitbox from empty circles
                        {...shapeProps}
                    />
                )
            case ToolType.Rectangle:
                return (
                    <Rect
                        width={points[2] - points[0]}
                        height={points[3] - points[1]}
                        fillEnabled
                        {...shapeProps}
                    />
                )
            case ToolType.Select:
                return (
                    <Rect
                        width={points[2] - points[0]}
                        height={points[3] - points[1]}
                        stroke={SEL_STROKE}
                        strokeEnabled={SEL_STROKE_ENABLED}
                        fill={SEL_FILL}
                        fillEnabled={SEL_FILL_ENABLED}
                        {...shapeProps}
                    />
                )
            default:
                return <></>
        }
    }

    reset(): void {
        this.pointsSegments = []
        this.x = 0
        this.y = 0
    }
}

export function isContinuous(type: ToolType): boolean {
    return type === ToolType.Pen
}

function appendLinePoint(pts: number[], newPoint: Point): void {
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
