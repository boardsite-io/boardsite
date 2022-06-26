import { Vector, Polygon, Box, testPolygonPolygon } from "sat"
import { Stroke, StrokeCollection, ToolType } from "drawing/stroke/index.types"

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

/**
 * Creates a simple reactangular polygon
 */
export function getSelectionPolygon([x1, y1, x2, y2]: number[]): Polygon {
    const box = new Box(
        // set the left upper point as reference
        new Vector(Math.min(x1, x2), Math.min(y1, y2)),
        Math.abs(x1 - x2),
        Math.abs(y1 - y2)
    )
    return box.toPolygon()
}

/**
 * Test the selection polygon against all strokes with multiple hitboxe
 * segments and return a set of all collided stroke IDs.
 */
export function matchStrokeCollision(
    strokes: StrokeCollection,
    selectionPolygon: Polygon
): StrokeCollection {
    const result: StrokeCollection = {}
    Object.keys(strokes).forEach((id) => {
        // test each hitbox segment
        for (let i = 0; i < (strokes[id].hitboxes ?? []).length; i += 1) {
            if (
                testPolygonPolygon(
                    (strokes[id].hitboxes ?? [])[i],
                    selectionPolygon
                )
            ) {
                result[id] = strokes[id]
                break
            }
        }
    })
    return result
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

/**
 * Get the hitboxes array of a stroke
 */
export const getStrokeHitbox = (stroke: Stroke): Polygon[] => {
    const hitboxes: Polygon[] = []

    switch (stroke.type) {
        case ToolType.Line:
        case ToolType.Highlighter:
        case ToolType.Pen: {
            // get hitboxes of all segments of the current stroke
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
        case ToolType.Rectangle: {
            const [x1, y1, x2, y2] = getTransformedPoints(stroke)

            hitboxes.push(
                getHitboxPolygon([x1, y1, x1, y2], stroke),
                getHitboxPolygon([x1, y2, x2, y2], stroke),
                getHitboxPolygon([x2, y2, x2, y1], stroke),
                getHitboxPolygon([x2, y1, x1, y1], stroke)
            )
            return hitboxes
        }
        case ToolType.Circle: {
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

                hitboxes.push(
                    getHitboxPolygon([p1.x, p1.y, p2.x, p2.y], stroke)
                )
            }

            return hitboxes
        }
        default:
            return hitboxes
    }
}