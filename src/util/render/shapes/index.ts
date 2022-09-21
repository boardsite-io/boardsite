import { LiveStroke } from "drawing/livestroke/index.types"
import { ToolType, Stroke } from "drawing/stroke/index.types"
import { strokeStyleToRGBA } from "util/color"
import { ERASED_OPACITY, ERASER_WIDTH } from "consts"
import canvasTxt from "canvas-txt"
import { settings } from "state/settings"
import { ERASER_STROKE, SELECTION_FILL } from "theme/globalStyles"

export const shiftPoints = (points: number[], x: number, y: number) =>
    points.map((p, i) => (i % 2 === 0 ? p + x : p + y))

export const draw = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    if ((stroke as Stroke).isHidden) return
    ctx.fillStyle = strokeStyleToRGBA(stroke.style)
    ctx.strokeStyle = strokeStyleToRGBA(stroke.style)
    drawStroke(ctx, stroke)
    // drawHitboxRects(ctx, stroke) // debug hitboxes
}

export const drawErased = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    ctx.fillStyle = strokeStyleToRGBA({
        ...stroke.style,
        opacity: stroke.style.opacity * ERASED_OPACITY,
    })
    ctx.strokeStyle = strokeStyleToRGBA({
        ...stroke.style,
        opacity: stroke.style.opacity * ERASED_OPACITY,
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
    drawShape[stroke.type]?.(ctx, pts, stroke)

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

const drawTextField = (
    ctx: CanvasRenderingContext2D,
    points: number[],
    stroke: Stroke | LiveStroke
) => {
    const { left, top, width, height } = getUnflippedRect(points)
    if (!stroke.textfield?.text) {
        ctx.lineWidth = 1
        ctx.fillStyle = `${settings.getTheme().palette.editor.paper}ee`
        ctx.strokeStyle = `${settings.getTheme().palette.secondary.main}66`
        drawRoundRect(ctx, left, top, width, height, 4, true, true)
    } else {
        const {
            text,
            color,
            hAlign,
            vAlign,
            font,
            fontWeight,
            fontSize,
            lineHeight,
        } = stroke.textfield

        ctx.fillStyle = color
        canvasTxt.align = hAlign
        canvasTxt.vAlign = vAlign
        canvasTxt.font = font
        canvasTxt.fontWeight = fontWeight
        canvasTxt.fontSize = fontSize
        canvasTxt.lineHeight = lineHeight
        canvasTxt.drawText(ctx, text, left, top, width, height)
    }
}

const drawShape = {
    [ToolType.Eraser]: drawEraser,
    [ToolType.Pen]: drawPen,
    [ToolType.Line]: drawLine,
    [ToolType.Circle]: drawCircle,
    [ToolType.Rectangle]: drawRect,
    [ToolType.Select]: drawSelect,
    [ToolType.Pan]: undefined,
    [ToolType.Highlighter]: drawPen,
    [ToolType.Textfield]: drawTextField,
}

export const drawHitboxRects = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke | LiveStroke
) => {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = 1
    ctx.strokeStyle = "#00ff00"
    ctx.beginPath()

    stroke.hitboxes?.forEach((polygon) => {
        const { points, pos } = polygon

        points.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x + pos.x, point.y + pos.y)
            } else {
                ctx.lineTo(point.x + pos.x, point.y + pos.y)
            }
        })
        ctx.closePath()
        ctx.stroke()
    })
}

export const getUnflippedRect = (points: Stroke["points"]) => {
    const [x1, y1, x2, y2] = points
    const width = Math.abs(x2 - x1)
    const height = Math.abs(y2 - y1)
    const left = Math.min(x1, x2)
    const top = Math.min(y1, y2)

    return {
        left,
        top,
        width,
        height,
    }
}

export const applyTransformOnPoints = (stroke: Stroke) => {
    stroke.points = stroke.points.map((point, i) =>
        i % 2 === 0
            ? (point + stroke.x) * stroke.scaleX
            : (point + stroke.y) * stroke.scaleY
    )
    stroke.x = 0
    stroke.y = 0
    stroke.scaleX = 1
    stroke.scaleY = 1
}

const drawRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill = false,
    stroke = true
) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    if (fill) {
        ctx.fill()
    }
    if (stroke) {
        ctx.stroke()
    }
}
