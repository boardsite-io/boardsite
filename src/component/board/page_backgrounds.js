const blank = (context, shape) => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)
}

const checkered = (context, shape) => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)

    // make checkered math paper
    const gap = 20
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
    context.setAttr("strokeStyle", "#00000088")
    context.stroke()

    // (!) Konva specific method, it is very important
    // it will apply are required styles
    // context.fillStrokeShape(shape)
}

const ruled = (context, shape) => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)

    const numRows = 30
    // make ruled math paper
    const gap = height / numRows
    for (let i = 1; i < numRows; i += 1) {
        const y = i * gap
        context.moveTo(0, y)
        context.lineTo(width, y)
    }
    context.setAttr("strokeStyle", "#00000088")
    context.stroke()
}

export default {
    blank,
    checkered,
    ruled,
}
