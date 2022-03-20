import { ERASER_STROKE, SELECTION_FILL } from "App/global.styled"
import { LiveStroke } from "drawing/livestroke/index.types"
import { ToolType, Stroke } from "drawing/stroke/index.types"
import { strokeStyleToRGBA } from "util/color"
import { ERASED_OPACITY, ERASER_WIDTH } from "../../../../consts"

export const shiftPoints = (points: number[], x: number, y: number) =>
    points.map((p, i) => (i % 2 === 0 ? p + x : p + y))

export const draw = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    ctx.fillStyle = strokeStyleToRGBA(stroke.style)
    ctx.strokeStyle = strokeStyleToRGBA(stroke.style)
    drawStroke(ctx, stroke)
}

export const drawErased = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    ctx.fillStyle = strokeStyleToRGBA({
        ...stroke.style,
        opacity: ERASED_OPACITY,
    })
    ctx.strokeStyle = strokeStyleToRGBA({
        ...stroke.style,
        opacity: ERASED_OPACITY,
    })
    drawStroke(ctx, stroke)
}

const drawStroke = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = stroke.style.width

    const { points, x, y, scaleX, scaleY } = stroke
    const sX = scaleX ?? 1
    const sY = scaleY ?? 1
    const isScaled = sX !== 1 || sY !== 1

    ctx.beginPath()
    if (isScaled) {
        ctx.scale(sX, sY)
    }

    const pts = shiftPoints(points, x, y)
    drawShape[stroke.type]?.(ctx, pts)

    ctx.stroke()
    if (isScaled) {
        ctx.scale(1 / sX, 1 / sY)
    }
}

const drawPen = (ctx: CanvasRenderingContext2D, points: number[]) => {
    ctx.moveTo(points[0], points[1])
    let n = 0
    while (n < points.length) {
        ctx.lineTo(points[n++], points[n++])
    }
}

const drawEraser = (ctx: CanvasRenderingContext2D, points: number[]) => {
    ctx.strokeStyle = ERASER_STROKE
    ctx.lineWidth = ERASER_WIDTH
    drawPen(ctx, points)
}

const drawLine = (ctx: CanvasRenderingContext2D, points: number[]) => {
    const [x1, y1, x2, y2] = points
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
}

const drawRect = (ctx: CanvasRenderingContext2D, points: number[]) => {
    const [x1, y1, x2, y2] = points
    ctx.rect(x1, y1, x2 - x1, y2 - y1)
}

const drawCircle = (ctx: CanvasRenderingContext2D, points: number[]) => {
    const [x1, y1, x2, y2] = points
    const rx = (x2 - x1) / 2
    const ry = (y2 - y1) / 2
    ctx.ellipse(x1 + rx, y1 + ry, Math.abs(rx), Math.abs(ry), 0, Math.PI * 2, 0)
}

const drawSelect = (ctx: CanvasRenderingContext2D, points: number[]) => {
    const [x1, y1, x2, y2] = points
    ctx.fillStyle = SELECTION_FILL
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
}

const drawShape = {
    [ToolType.Eraser]: drawEraser,
    [ToolType.Pen]: drawPen,
    [ToolType.Line]: drawLine,
    [ToolType.Circle]: drawCircle,
    [ToolType.Rectangle]: drawRect,
    [ToolType.Select]: drawSelect,
    [ToolType.Pan]: undefined,
}

export const drawHitboxRects = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke
) => {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = 1
    // ctx.fillStyle = "#00000033"
    ctx.strokeStyle = "#00ff00"
    ctx.beginPath()

    stroke.hitboxes?.forEach((polygon) => {
        if (polygon.points.length !== 4) {
            // TODO: find out why there are length 2 polygon points
            // console.log("Weird polygon detected: ", polygon, stroke)
            return
        }

        const [p1, p2, p3, p4] = polygon.points
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.lineTo(p3.x, p3.y)
        ctx.lineTo(p4.x, p4.y)
        ctx.closePath()
        ctx.stroke()
    })
}
