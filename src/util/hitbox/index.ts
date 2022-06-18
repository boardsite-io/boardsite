import { Vector, Polygon, Box, testPolygonPolygon } from "sat"
import {
    Scale,
    Stroke,
    StrokeCollection,
    ToolType,
} from "drawing/stroke/index.types"

export function getHitboxPolygon(
    [x1, y1, x2, y2]: number[],
    width: number,
    scale?: Scale
): Polygon {
    const dx = x2 - x1
    const dy = y2 - y1
    let dxw
    let dyw
    if (!dy) {
        dxw = 0
        dyw = width / 2
    } else if (!dx) {
        dxw = width / 2
        dyw = 0
    } else {
        const ratio = dx / dy
        dxw = Math.sqrt((width / 2) ** 2 / (1 + ratio ** 2))
        dyw = dxw * ratio
    }

    // compensate the effect of the scale on the width
    dxw *= scale?.x || 1
    dyw *= scale?.y || 1

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

/**
 * Get the hitboxes array of a stroke
 */
export const getStrokeHitbox = ({
    type,
    x,
    y,
    style,
    scaleX,
    scaleY,
    points,
}: Stroke): Polygon[] => {
    const hitboxes: Polygon[] = []

    switch (type) {
        case ToolType.Line:
        case ToolType.Highlighter:
        case ToolType.Pen: {
            // get hitboxes of all segments of the current stroke
            for (let i = 0; i < points.length - 2; i += 2) {
                const section = points.slice(i, i + 4)
                for (let j = 0; j < 4; j += 2) {
                    // compensate for the scale and offset
                    section[j] = (section[j] + x) * scaleX
                    section[j + 1] = (section[j + 1] + y) * scaleY
                }
                hitboxes.push(
                    getHitboxPolygon(section, style.width, {
                        x: scaleX,
                        y: scaleY,
                    })
                )
            }
            return hitboxes
        }
        case ToolType.Rectangle: {
            let [x1, y1, x2, y2] = points
            x1 = (x1 + x) * scaleX
            y1 = (y1 + y) * scaleY
            x2 = (x2 + x) * scaleX
            y2 = (y2 + y) * scaleY

            hitboxes.push(
                getHitboxPolygon([x1, y1, x1, y2], style.width, {
                    x: scaleX,
                    y: scaleY,
                }),
                getHitboxPolygon([x1, y2, x2, y2], style.width, {
                    x: scaleX,
                    y: scaleY,
                }),
                getHitboxPolygon([x2, y2, x2, y1], style.width, {
                    x: scaleX,
                    y: scaleY,
                }),
                getHitboxPolygon([x2, y1, x1, y1], style.width, {
                    x: scaleX,
                    y: scaleY,
                })
            )
            return hitboxes
        }
        case ToolType.Circle: {
            let [x1, y1, x2, y2] = points
            x1 = (x1 + x) * scaleX
            y1 = (y1 + y) * scaleY
            x2 = (x2 + x) * scaleX
            y2 = (y2 + y) * scaleY

            hitboxes.push(
                getHitboxPolygon([x1, y1, x1, y2], style.width, {
                    x: scaleX,
                    y: scaleY,
                }),
                getHitboxPolygon([x1, y2, x2, y2], style.width, {
                    x: scaleX,
                    y: scaleY,
                }),
                getHitboxPolygon([x2, y2, x2, y1], style.width, {
                    x: scaleX,
                    y: scaleY,
                }),
                getHitboxPolygon([x2, y1, x1, y1], style.width, {
                    x: scaleX,
                    y: scaleY,
                })
            )
            return hitboxes
        }
        default:
            return hitboxes
    }
}
