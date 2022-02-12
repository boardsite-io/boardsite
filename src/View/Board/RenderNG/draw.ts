import { LiveStroke } from "drawing/livestroke/index.types"
import { ToolType, Stroke } from "drawing/stroke/index.types"
import { StrokeStyle } from "./index.types"

export const draw = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = stroke.style.width
    ctx.fillStyle = stroke.style.color
    ctx.strokeStyle = stroke.style.color

    ctx.beginPath()
    drawShape[stroke.type]?.(ctx, stroke)
    ctx.stroke()
    // ctx.fill()
}

export const drawPen = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const pts = stroke.points.map((p, i) =>
        i % 2 === 0 ? p + stroke.x : p + stroke.y
    )

    ctx.moveTo(pts[0], pts[1])
    let n = 0
    while (n < pts.length) {
        ctx.lineTo(pts[n++], pts[n++])
    }
}

export const drawLine = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const [x1, y1, x2, y2] = stroke.points
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
}

export const drawRect = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const [x1, y1, x2, y2] = stroke.points
    ctx.rect(x1, y1, x2 - x1, y2 - y1)
}

export const drawCircle = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    const [x1, y1, x2, y2] = stroke.points
    const rx = (x2 - x1) / 2
    const ry = (y2 - y1) / 2
    ctx.ellipse(x1 + rx, y1 + ry, Math.abs(rx), Math.abs(ry), 0, Math.PI * 2, 0)
}

const drawShape = {
    [ToolType.Eraser]: drawLine,
    [ToolType.Pen]: drawPen,
    [ToolType.Line]: drawLine,
    [ToolType.Circle]: drawCircle,
    [ToolType.Rectangle]: drawRect,
    [ToolType.Select]: undefined,
    [ToolType.Pan]: undefined,
}

export const strokeStyleToRGBA = (style: StrokeStyle): string => {
    const r = parseInt(style.color.slice(1, 3), 16)
    const g = parseInt(style.color.slice(3, 5), 16)
    const b = parseInt(style.color.slice(5, 7), 16)
    const alpha = Math.floor(255 * style.opacity)
    return `rgba(${r},${g},${b},${alpha})`
}
