/* eslint-disable prefer-destructuring */
import {
    DEFAULT_COLOR,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    ERASER_WIDTH,
} from "consts"
import { handleAddStrokes, handleDeleteStrokes } from "drawing/handlers"
import { MOVE_SHAPES_TO_DRAG_LAYER } from "redux/board/board"
import { CLEAR_ERASED_STROKES, SET_ERASED_STROKES } from "redux/drawing/drawing"
import store from "redux/store"
import { perfectDrawing, simplifyRDP } from "../stroke/simplify"
import {
    getHitboxPolygon,
    getSelectionPolygon,
    matchStrokeCollision,
} from "../stroke/hitbox"
import { BoardStroke } from "../stroke"
import { Point, Stroke, StrokeMap, Tool, ToolType } from "../stroke/index.types"
import { LiveStroke } from "./index.types"

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
    }

    setTool(tool: Tool): BoardLiveStroke {
        this.type = tool.type
        this.style = tool.style
        return this
    }

    start(point: Point, pageId: string): BoardLiveStroke {
        this.reset()
        this.pageId = pageId
        this.points = [point.x, point.y]

        if (
            this.type === ToolType.Circle ||
            this.type === ToolType.Rectangle ||
            this.type === ToolType.Select
        ) {
            this.x = point.x
            this.y = point.y
        }

        return this
    }

    move(point: Point, pagePosition: Point): void {
        this.addPoint(point)
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

    addPoint(point: Point): void {
        switch (this.type) {
            case ToolType.Pen:
            case ToolType.Eraser: {
                const segmentSize = 8
                this.points.push(point.x, point.y)
                const last = this.points.splice(-segmentSize, segmentSize)
                this.points = this.points.concat(perfectDrawing(last))
                return
            }
            case ToolType.Circle:
                this.x = this.points[0] + (point.x - this.points[0]) / 2
                this.y = this.points[1] + (point.y - this.points[1]) / 2
                break
            case ToolType.Rectangle:
            case ToolType.Select:
                this.x = this.points[0]
                this.y = this.points[1]
                break
            default:
                break
        }

        // only start & end point required for non continuous
        this.points = [this.points[0], this.points[1], point.x, point.y]
    }

    /**
     * Convert livestroke into the normal stroke format
     */
    finalize(pagePosition: Point): Stroke {
        this.processPoints(pagePosition)
        const stroke = new BoardStroke(this)
        this.reset()
        return stroke
    }

    processPoints(pagePosition: Point): void {
        const { x: pageX, y: pageY } = pagePosition
        const stageScale = store.getState().board.stage.attrs.scaleX

        switch (this.type) {
            case ToolType.Pen: {
                const epsilon = 0.25
                const sections = 3
                this.points = simplifyRDP(
                    this.points,
                    epsilon / stageScale,
                    sections
                )
                break
            }
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
    }

    isReset(): boolean {
        return this.points.length === 0
    }

    private numUpdates = 0
    selectLineCollision(strokes: StrokeMap, pagePosition: Point): StrokeMap {
        const target = 5
        const res: StrokeMap = {}
        this.numUpdates += 1
        if (this.numUpdates === target) {
            const p = this.points
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

    static async register(stroke: Stroke, pagePosition: Point): Promise<void> {
        switch (stroke.type) {
            case ToolType.Eraser: {
                const { erasedStrokes } = store.getState().drawing
                const strokes = Object.keys(erasedStrokes).map(
                    (id) => erasedStrokes[id]
                )
                if (strokes.length > 0) {
                    handleDeleteStrokes(...strokes)
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
            default: {
                handleAddStrokes(false, stroke)
            }
        }
    }
}

const subPageOffset = (points: number[], pagePosition: Point): number[] =>
    points.map((p, i) => {
        const pt = i % 2 ? p - pagePosition.y : p - pagePosition.x
        return Math.round(pt * 100) / 100 // round to a reasonable precision
    })
