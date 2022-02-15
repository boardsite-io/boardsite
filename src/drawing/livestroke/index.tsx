/* eslint-disable prefer-destructuring */
import {
    DEFAULT_COLOR,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    ERASER_WIDTH,
} from "consts"
import { handleAddStrokes, handleDeleteStrokes } from "drawing/handlers"
import { SET_TRANSFORM_STROKES } from "redux/board"
import { CLEAR_ERASED_STROKES, SET_ERASED_STROKES } from "redux/drawing"
import store from "redux/store"
import { Page } from "redux/board/index.types"
import { viewState } from "state/view"
import { perfectDrawing, simplifyRDP } from "../stroke/simplify"
import {
    getHitboxPolygon,
    getSelectionPolygon,
    matchStrokeCollision,
} from "../stroke/hitbox"
import { BoardStroke } from "../stroke"
import {
    Point,
    Stroke,
    StrokeCollection,
    Tool,
    ToolType,
} from "../stroke/index.types"
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

        return this
    }

    move(point: Point): void {
        this.addPoint(point)
        if (this.type === ToolType.Eraser) {
            this.moveEraser()
        }
    }

    moveEraser(): void {
        const { strokes } = store.getState().board.pageCollection[this.pageId]
        const selectedStrokes = this.selectLineCollision(strokes)

        if (Object.keys(selectedStrokes).length > 0) {
            store.dispatch(SET_ERASED_STROKES(selectedStrokes))
        }
    }

    addPoint(point: Point): void {
        switch (this.type) {
            case ToolType.Eraser:
            case ToolType.Pen: {
                this.points = perfectDrawing(this.points, point)
                break
            }
            case ToolType.Line:
            case ToolType.Circle:
            case ToolType.Rectangle:
            case ToolType.Select:
                this.points[2] = point.x
                this.points[3] = point.y
                break
            default:
                break
        }
    }

    /**
     * Convert livestroke into the normal stroke format
     */
    finalize(): Stroke {
        this.processPoints()
        const stroke = new BoardStroke(this)
        this.reset()
        return stroke
    }

    processPoints(): void {
        const { scale } = viewState.getTransformState()

        switch (this.type) {
            case ToolType.Pen: {
                const epsilon = 0.25
                const sections = 3
                // this.points = perfectDrawing(this.points)
                this.points = simplifyRDP(
                    this.points,
                    epsilon / scale,
                    sections
                )
                break
            }
            default:
                break
        }
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
    selectLineCollision(strokes: StrokeCollection): StrokeCollection {
        const target = 5
        const res: StrokeCollection = {}
        this.numUpdates += 1
        if (this.numUpdates === target) {
            const p = this.points
            // create a line between the latest point and 5th last point
            const minIndex = Math.max(p.length - 2 - 2 * target, 0)
            const line = p
                .slice(minIndex, minIndex + 2)
                .concat(p.slice(p.length - 2))

            this.numUpdates = 0
            const selectionPolygon = getHitboxPolygon(line, ERASER_WIDTH)

            return matchStrokeCollision(strokes, selectionPolygon)
        }
        return res
    }

    static async register(stroke: Stroke): Promise<void> {
        switch (stroke.type) {
            case ToolType.Eraser: {
                const { erasedStrokes } = store.getState().drawing
                const strokes = Object.keys(erasedStrokes).map(
                    (id) => erasedStrokes[id]
                )
                if (strokes.length > 0) {
                    handleDeleteStrokes(strokes)
                }
                store.dispatch(CLEAR_ERASED_STROKES())
                break
            }
            case ToolType.Select: {
                const { strokes } = store.getState().board.pageCollection[
                    stroke.pageId
                ] as Page
                const selectedStrokes = matchStrokeCollision(
                    strokes,
                    getSelectionPolygon(stroke.points)
                )
                store.dispatch(
                    SET_TRANSFORM_STROKES(Object.values(selectedStrokes))
                )
                break
            }
            default: {
                handleAddStrokes([stroke], false)
            }
        }
    }
}
