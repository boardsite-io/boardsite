import { ERASER_STROKE, SELECTION_FILL } from "App/theme"
import { LiveStroke } from "drawing/livestroke/index.types"
import { ToolType, Stroke } from "drawing/stroke/index.types"
import { StrokeStyle } from "../index.types"
import { ERASER_WIDTH } from "../../../../consts"

export const shiftPoints = (points: number[], x: number, y: number) =>
    points.map((p, i) => (i % 2 === 0 ? p + x : p + y))

export const draw = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = stroke.style.width
    ctx.fillStyle = strokeStyleToRGBA(stroke.style)
    ctx.strokeStyle = strokeStyleToRGBA(stroke.style)

    drawShape[stroke.type]?.(ctx, stroke)
}

const drawPen = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const { points, x, y, scaleX, scaleY } = stroke
    const pts = shiftPoints(points, x, y)

    const sX = scaleX ?? 1
    const sY = scaleY ?? 1
    const isScaled = sX !== 1 || sY !== 1

    ctx.beginPath()
    if (isScaled) {
        ctx.scale(sX, sY)
    }
    ctx.moveTo(pts[0], pts[1])
    let n = 0
    while (n < pts.length) {
        ctx.lineTo(pts[n++], pts[n++])
    }
    ctx.stroke()
    if (isScaled) {
        ctx.scale(1 / sX, 1 / sY)
    }
}

const drawEraser = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    ctx.strokeStyle = ERASER_STROKE
    ctx.lineWidth = ERASER_WIDTH
    drawPen(ctx, stroke)
}

const drawLine = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const [x1, y1, x2, y2] = stroke.points
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

const drawRect = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const [x1, y1, x2, y2] = stroke.points
    ctx.beginPath()
    ctx.rect(x1, y1, x2 - x1, y2 - y1)
    ctx.stroke()
}

const drawCircle = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const [x1, y1, x2, y2] = stroke.points
    const rx = (x2 - x1) / 2
    const ry = (y2 - y1) / 2
    ctx.beginPath()
    ctx.ellipse(x1 + rx, y1 + ry, Math.abs(rx), Math.abs(ry), 0, Math.PI * 2, 0)
    ctx.stroke()
}

const drawSelect = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const [x1, y1, x2, y2] = stroke.points
    ctx.fillStyle = SELECTION_FILL
    ctx.beginPath()
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
    ctx.stroke()
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

const strokeStyleToRGBA = (style: StrokeStyle): string => {
    const r = parseInt(style.color.slice(1, 3), 16)
    const g = parseInt(style.color.slice(3, 5), 16)
    const b = parseInt(style.color.slice(5, 7), 16)
    const alpha = Math.floor(255 * style.opacity)
    return `rgba(${r},${g},${b},${alpha})`
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
