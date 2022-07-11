import { Vector, Polygon, Box, testPolygonPolygon, pointInPolygon } from "sat"
import {
    Point,
    Stroke,
    StrokeCollection,
    ToolType,
} from "drawing/stroke/index.types"

type GetStrokesInPolygonProps = {
    strokes: StrokeCollection
    polygon: Polygon
    filterType?: ToolType
}

export function getStrokesInPolygon({
    strokes,
    polygon,
    filterType,
}: GetStrokesInPolygonProps): Stroke[] {
    const matchingStrokes: Stroke[] = []

    Object.values(strokes).forEach((stroke) => {
        const passesFilter = !filterType || stroke.type === filterType
        const { hitboxes } = stroke

        if (passesFilter && hitboxes?.length) {
            for (let i = 0; i < hitboxes.length; i += 1) {
                if (testPolygonPolygon(polygon, hitboxes[i])) {
                    matchingStrokes.push(stroke)
                    break
                }
            }
        }
    })
    return matchingStrokes
}

type GetStrokesInPointProps = {
    strokes: StrokeCollection
    point: Point
    filterType?: ToolType
}

export const getStrokesInPoint = ({
    strokes,
    point,
    filterType,
}: GetStrokesInPointProps): Stroke[] => {
    const vector = getPointVector(point)
    const matchingStrokes: Stroke[] = []

    Object.values(strokes).forEach((stroke) => {
        const passesFilter = !filterType || stroke.type === filterType
        const { hitboxes } = stroke

        if (passesFilter && hitboxes?.length) {
            for (let i = 0; i < hitboxes.length; i += 1) {
                if (pointInPolygon(vector, hitboxes[i])) {
                    matchingStrokes.push(stroke)
                    break
                }
            }
        }
    })
    return matchingStrokes
}

export function getHitboxPolygon(
    [x1, y1, x2, y2]: number[],
    stroke: Pick<Stroke, "style" | "scaleX" | "scaleY">
): Polygon {
    const dx = x2 - x1
    const dy = y2 - y1
    let dxw
    let dyw
    if (!dy) {
        dxw = 0
        dyw = stroke.style.width / 2
    } else if (!dx) {
        dxw = stroke.style.width / 2
        dyw = 0
    } else {
        const ratio = dx / dy
        dxw = Math.sqrt((stroke.style.width / 2) ** 2 / (1 + ratio ** 2))
        dyw = dxw * ratio
    }

    // compensate the effect of the scale on the width
    dxw *= stroke.scaleX
    dyw *= stroke.scaleY

    // calc vertices
    return new Polygon(new Vector(), [
        new Vector(x1 - dxw, y1 + dyw),
        new Vector(x2 - dxw, y2 + dyw),
        new Vector(x2 + dxw, y2 - dyw),
        new Vector(x1 + dxw, y1 - dyw),
    ])
}

export const getPointVector = (point: Point) => new Vector(point.x, point.y)

/**
 * Creates a simple reactangular polygon
 */
export function getRectanglePolygon([x1, y1, x2, y2]: number[]): Polygon {
    const box = new Box(
        // set the left upper point as reference
        new Vector(Math.min(x1, x2), Math.min(y1, y2)),
        Math.abs(x1 - x2),
        Math.abs(y1 - y2)
    )
    return box.toPolygon()
}

interface GetEllipseOutlineProps {
    x: number //  ellipse center (x-axis)
    y: number //  ellipse center (y-axis)
    rx: number // ellipse radius (x-axis)
    ry: number //  ellipse radius (y-axis)
    // specify how many segments to divide each ellipse quarter into
    // => 4 segmentsPerQuarter = 16 segments total
    segmentsPerQuarter: number
}

export const getEllipseOutline = ({
    x,
    y,
    rx,
    ry,
    segmentsPerQuarter,
}: GetEllipseOutlineProps) => {
    const outlinePoints = new Array(segmentsPerQuarter * 4)

    // Set top, bottom, left, right points
    outlinePoints[0] = { x: x + rx, y }
    outlinePoints[segmentsPerQuarter] = { x, y: y + ry }
    outlinePoints[2 * segmentsPerQuarter] = { x: x - rx, y }
    outlinePoints[3 * segmentsPerQuarter] = { x, y: y - ry }

    for (let i = 1; i < segmentsPerQuarter; i++) {
        const angleRadian = (i * Math.PI) / (segmentsPerQuarter * 2)

        const xOff =
            (rx * ry) /
            Math.sqrt(ry ** 2 + rx ** 2 * Math.tan(angleRadian) ** 2)
        const yOff = Math.tan(angleRadian) * xOff

        outlinePoints[i] = {
            x: x + xOff,
            y: y + yOff,
        }
        outlinePoints[2 * segmentsPerQuarter - i] = {
            x: x - xOff,
            y: y + yOff,
        }
        outlinePoints[2 * segmentsPerQuarter + i] = {
            x: x - xOff,
            y: y - yOff,
        }
        outlinePoints[4 * segmentsPerQuarter - i] = {
            x: x + xOff,
            y: y - yOff,
        }
    }

    return outlinePoints
}

export const getTransformedPoints = (stroke: Stroke): Stroke["points"] =>
    stroke.points.map((value, index) =>
        index % 2 === 0
            ? (value + stroke.x) * stroke.scaleX
            : (value + stroke.y) * stroke.scaleY
    )

type GetHitbox = (stroke: Stroke) => Polygon[]

const getPenHitbox: GetHitbox = (stroke) => {
    const hitboxes: Polygon[] = []

    for (let i = 0; i < stroke.points.length - 2; i += 2) {
        const section = stroke.points.slice(i, i + 4)
        for (let j = 0; j < 4; j += 2) {
            // compensate for the scale and offset
            section[j] = (section[j] + stroke.x) * stroke.scaleX
            section[j + 1] = (section[j + 1] + stroke.y) * stroke.scaleY
        }
        hitboxes.push(getHitboxPolygon(section, stroke))
    }
    return hitboxes
}

const getRectangleHitbox: GetHitbox = (stroke) => {
    const hitboxes: Polygon[] = []
    const [x1, y1, x2, y2] = getTransformedPoints(stroke)

    hitboxes.push(
        getHitboxPolygon([x1, y1, x1, y2], stroke),
        getHitboxPolygon([x1, y2, x2, y2], stroke),
        getHitboxPolygon([x2, y2, x2, y1], stroke),
        getHitboxPolygon([x2, y1, x1, y1], stroke)
    )
    return hitboxes
}

const getCircleHitbox: GetHitbox = (stroke) => {
    const hitboxes: Polygon[] = []
    const [x1, y1, x2, y2] = getTransformedPoints(stroke)

    // Radius vector
    const rxv = (x2 - x1) / 2
    const ryv = (y2 - y1) / 2

    const outlinePoints = getEllipseOutline({
        x: x1 + rxv,
        y: y1 + ryv,
        rx: Math.abs(rxv),
        ry: Math.abs(ryv),
        segmentsPerQuarter: 8,
    })

    for (let i = 0; i < outlinePoints.length; i++) {
        const p1 = outlinePoints[i]
        const p2 = outlinePoints[i + 1] ?? outlinePoints[0]

        hitboxes.push(getHitboxPolygon([p1.x, p1.y, p2.x, p2.y], stroke))
    }

    return hitboxes
}

const getTextfieldHitbox: GetHitbox = (stroke) => {
    const hitboxes: Polygon[] = []
    const points = getTransformedPoints(stroke)
    const hitbox = getRectanglePolygon(points)
    hitboxes.push(hitbox)
    return hitboxes
}

const strokeHitboxGetters: Record<ToolType, GetHitbox> = {
    [ToolType.Line]: getPenHitbox,
    [ToolType.Highlighter]: getPenHitbox,
    [ToolType.Pen]: getPenHitbox,
    [ToolType.Rectangle]: getRectangleHitbox,
    [ToolType.Circle]: getCircleHitbox,
    [ToolType.Textfield]: getTextfieldHitbox,
    [ToolType.Pan]: () => [],
    [ToolType.Eraser]: () => [],
    [ToolType.Select]: () => [],
}

export const getStrokeHitboxes = (stroke: Stroke): Polygon[] =>
    strokeHitboxGetters[stroke.type](stroke)
