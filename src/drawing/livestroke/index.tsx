/* eslint-disable prefer-destructuring */
import {
    DEFAULT_COLOR,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    ERASER_WIDTH,
} from "consts"
import { drawing } from "state/drawing"
import { view } from "state/view"
import { board } from "state/board"
import { getHitboxPolygon, getStrokesInPolygon } from "drawing/hitbox"
import { perfectDrawing, simplifyRDP } from "../stroke/simplify"
import {
    Point,
    Stroke,
    StrokeCollection,
    Tool,
    ToolType,
} from "../stroke/index.types"
import { LiveStroke } from "./index.types"
import { registerStroke } from "./register"

export class BoardLiveStroke implements LiveStroke {
    id = ""
    pageId = ""
    x = 0
    y = 0
    scaleX = 1
    scaleY = 1
    type = DEFAULT_TOOL
    style = {
        color: DEFAULT_COLOR,
        width: DEFAULT_WIDTH,
        opacity: 1,
    }
    points: number[] = []

    start(point: Point, pageId: string) {
        this.reset()
        this.setTool(drawing.getState().tool)
        this.pageId = pageId
        this.points = [point.x, point.y]
    }

    move(point: Point): void {
        this.addPoint(point)
        if (this.type === ToolType.Eraser) {
            this.moveEraser()
        }
    }

    end(point: Point) {
        this.move(point)
        this.processPoints()
        registerStroke(this)
        this.reset()
    }

    reset(): void {
        this.pageId = ""
        this.x = 0
        this.y = 0
        this.scaleX = 1
        this.scaleY = 1
        this.points = []
    }

    setTool(tool: Tool) {
        this.type = tool.type
        this.style = tool.style
    }

    moveEraser(): void {
        const { strokes } = board.getState().pageCollection[this.pageId]
        const selectedStrokes = this.selectLineCollision(strokes)

        if (Object.keys(selectedStrokes).length > 0) {
            drawing.setErasedStrokes(selectedStrokes)
        }
    }

    addPoint(point: Point): void {
        switch (this.type) {
            case ToolType.Eraser:
            case ToolType.Highlighter:
            case ToolType.Pen: {
                this.points = perfectDrawing(this.points, point)
                break
            }
            case ToolType.Line:
            case ToolType.Circle:
            case ToolType.Rectangle:
            case ToolType.Select:
            case ToolType.Textfield:
                this.points[2] = point.x
                this.points[3] = point.y
                break
            default:
                break
        }
    }

    processPoints(): void {
        const { scale } = view.getState().viewTransform

        switch (this.type) {
            case ToolType.Pen:
            case ToolType.Highlighter: {
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

    isReset(): boolean {
        return this.points.length === 0
    }

    private numUpdates = 0
    selectLineCollision(strokes: StrokeCollection): Stroke[] {
        const target = 5
        this.numUpdates += 1
        if (this.numUpdates !== target) return []

        const p = this.points
        // create a line between the latest point and 5th last point
        const minIndex = Math.max(p.length - 2 - 2 * target, 0)
        const line = p
            .slice(minIndex, minIndex + 2)
            .concat(p.slice(p.length - 2))

        this.numUpdates = 0
        const polygon = getHitboxPolygon(line, {
            style: { width: ERASER_WIDTH } as Stroke["style"],
            scaleX: 1,
            scaleY: 1,
        })

        return getStrokesInPolygon({
            strokes,
            polygon,
        })
    }
}
