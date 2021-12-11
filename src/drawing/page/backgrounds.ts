import { backgroundStyle } from "consts"
import { Context } from "konva/lib/Context"
import { Shape, ShapeConfig } from "konva/lib/Shape"

const blank = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)
}

const checkered = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)

    // make checkered math paper
    const gap = 15
    const rows = Math.ceil(height / gap)
    const columns = Math.ceil(width / gap)
    for (let i = 1; i < rows; i += 1) {
        const y = i * gap
        context.moveTo(0, y)
        context.lineTo(width, y)
    }
    for (let i = 1; i < columns; i += 1) {
        const x = i * gap
        context.moveTo(x, 0)
        context.lineTo(x, height)
    }
    context.setAttr("strokeStyle", "#00000044")
    context.setAttr("lineWidth", 0.5)
    context.stroke()
}

const ruled = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)

    const numRows = 36
    // make ruled math paper
    const gap = height / numRows
    for (let i = 1; i < numRows; i += 1) {
        const y = i * gap
        context.moveTo(0, y)
        context.lineTo(width, y)
    }

    const boundary = 0.1
    context.moveTo(boundary * width, 0)
    context.lineTo(boundary * width, height)

    context.moveTo((1 - boundary) * width, 0)
    context.lineTo((1 - boundary) * width, height)

    context.setAttr("strokeStyle", "#00000044")
    context.setAttr("lineWidth", 0.5)
    context.stroke()
}

export const pageBackground = {
    [backgroundStyle.BLANK]: blank,
    [backgroundStyle.CHECKERED]: checkered,
    [backgroundStyle.RULED]: ruled,
}
