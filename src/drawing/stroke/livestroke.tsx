/* eslint-disable prefer-destructuring */
import {
    DEFAULT_COLOR,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    ERASER_WIDTH,
    MAX_LIVESTROKE_PTS,
    RDP_EPSILON,
    RDP_FORCE_SECTIONS,
} from "consts"
import { handleAddStrokes, handleDeleteStrokes } from "drawing/handlers"
import { KonvaEventObject } from "konva/lib/Node"
import { MOVE_SHAPES_TO_DRAG_LAYER } from "redux/board/board"
import { CLEAR_ERASED_STROKES, SET_ERASED_STROKES } from "redux/drawing/drawing"
import store from "redux/store"
import { simplifyRDP } from "../simplify"
import {
    getHitboxPolygon,
    getSelectionPolygon,
    matchStrokeCollision,
} from "./hitbox"
import { BoardStroke } from "./stroke"
import { LiveStroke, Point, Stroke, StrokeMap, Tool, ToolType } from "./types"

export const generateLiveStroke =
    (liveStroke: BoardLiveStroke) => (): BoardLiveStroke =>
        liveStroke

export class BoardLiveStroke implements LiveStroke {
    type: ToolType
    style: {
        color: string
        width: number
        opacity: number
    }

    pageId: string

    x: number
    y: number

    points: number[]
    pointsSegments: number[][]

    constructor(tool?: Tool) {
        this.pageId = ""
        this.x = 0
        this.y = 0
        this.type = tool?.type ?? DEFAULT_TOOL
        this.style = tool?.style ?? {
            color: DEFAULT_COLOR,
            width: DEFAULT_WIDTH,
            opacity: 1,
        }
        this.points = [] as number[]
        this.pointsSegments = [] as number[][]
    }

    setTool(tool: Tool): BoardLiveStroke {
        this.type = tool.type
        this.style = tool.style
        return this
    }

    start({ x, y }: Point, pageId: string): BoardLiveStroke {
        this.reset()
        this.pageId = pageId
        this.pointsSegments = [[x, y]]
        return this
    }

    move(point: Point, pagePosition: Point): void {
        this.addPoint(point, getStageScale())
        if (this.type === ToolType.Eraser) {
            this.moveEraser(pagePosition)
        }
    }

    moveEraser(pagePosition: Point): void {
        const { strokes } = store.getState().board.pageCollection[this.pageId]
        const selectedStrokes = this.selectLineCollision(strokes, pagePosition)
        if (Object.keys(selectedStrokes).length > 0) {
            store.dispatch(SET_ERASED_STROKES(selectedStrokes))
        }
    }

    addPoint(point: Point, scale: number): void {
        const { pointsSegments } = this
        const lastSegment = pointsSegments[pointsSegments.length - 1]

        switch (this.type) {
            case ToolType.Pen:
            case ToolType.Eraser:
                // for continuous strokes
                if (lastSegment.length < MAX_LIVESTROKE_PTS) {
                    appendLinePoint(lastSegment, point)
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

    async register(e: KonvaEventObject<MouseEvent>): Promise<void> {
        const pagePosition = e.target.getPosition()
        const stroke = this.finalize(getStageScale(), pagePosition)

        switch (stroke.type) {
            case ToolType.Eraser: {
                const { erasedStrokes } = store.getState().drawing
                const s = Object.keys(erasedStrokes).map(
                    (id) => erasedStrokes[id]
                )
                if (s.length > 0) {
                    handleDeleteStrokes(...s)
                }
                store.dispatch(CLEAR_ERASED_STROKES())
                break
            }
            case ToolType.Select: {
                const { strokes } =
                    store.getState().board.pageCollection[stroke.pageId]
                const selectedStrokes = matchStrokeCollision(
                    strokes,
                    getSelectionPolygon(stroke.points)
                )
                store.dispatch(
                    MOVE_SHAPES_TO_DRAG_LAYER({
                        strokes: Object.values(selectedStrokes),
                        pagePosition,
                    })
                )
                break
            }
            default:
                handleAddStrokes(stroke)
        }

        this.reset()
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

    isReset(): boolean {
        return this.points.length === 0 && this.pointsSegments.length === 0
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
            const selectionPolygon = getHitboxPolygon(
                subPageOffset(line, pagePosition), // compensate page offset in stage
                ERASER_WIDTH
            )

            return matchStrokeCollision(strokes, selectionPolygon)
        }
        return res
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

const newStrokeSegment = (
    pointsSegments: number[][],
    lastSegment: number[],
    scale: number,
    point: Point
) => {
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

const getStageScale = (): number => store.getState().board.view.stageScale.x
