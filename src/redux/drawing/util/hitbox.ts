import { ERASER_WIDTH } from "consts"
import { KonvaEventObject, Node, NodeConfig } from "konva/types/Node"
import { Vector, Polygon, Box, testPolygonPolygon } from "sat"
import {
    LiveStroke,
    Point,
    Scale,
    Stroke,
    StrokeMap,
    ToolType,
} from "../drawing.types"

export const calculateHitboxes = (liveStroke: LiveStroke): Polygon[] => {
    const { style, type, x, y, scaleX, scaleY, points } = liveStroke
    const hitboxes = [] as Polygon[]
    switch (type) {
        case ToolType.Line:
        case ToolType.Pen: {
            // get hitboxes of all segments of the current stroke
            for (let i = 0; i < points.length - 2; i += 2) {
                const section = points.slice(i, i + 4)
                for (let j = 0; j < 4; j += 2) {
                    // compensate for the scale and offset
                    section[j] = section[j] * scaleX + x
                    section[j + 1] = section[j + 1] * scaleY + y
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
            // only outline
            const x1 = x
            const y1 = y
            const x2 = x + (points[2] - points[0]) * scaleX
            const y2 = y + (points[3] - points[1]) * scaleY
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
            // only outline
            const radX = (points[2] - points[0]) / 2
            const radY = (points[3] - points[1]) / 2
            const x1 = x - radX * scaleX
            const y1 = y - radY * scaleY
            const x2 = x + radX * scaleX
            const y2 = y + radY * scaleY
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
    strokes: StrokeMap,
    selection: Polygon
): StrokeMap {
    const result: StrokeMap = {}
    Object.keys(strokes).forEach((id) => {
        // test each hitbox segment
        for (let i = 0; i < (strokes[id].hitboxes ?? []).length; i += 1) {
            if (
                testPolygonPolygon((strokes[id].hitboxes ?? [])[i], selection)
            ) {
                result[id] = strokes[id]
                break
            }
        }
    })
    return result
}

export function getSelectedShapes(
    selection: Stroke, // selection rectangle
    strokes: StrokeMap,
    e: KonvaEventObject<MouseEvent>
): Node<NodeConfig>[] {
    const selectedIds = matchStrokeCollision(
        strokes,
        getSelectionPolygon(selection.points)
    )
    const selectedShapes: Node<NodeConfig>[] = []
    e.target
        .getParent()
        ?.find(`.${selection.pageId}`)
        .toArray()
        .forEach((element: Node<NodeConfig>) => {
            if (selectedIds[element.attrs.id]) {
                selectedShapes.push(element)
            }
        })
    return selectedShapes
}

export const subPageOffset = (
    points: number[],
    pagePosition: Point
): number[] =>
    points.map((p, i) => {
        let pt = Math.round(p * 100) / 100 // round to a reasonable precision
        if (i % 2) {
            pt -= pagePosition.y
        } else {
            pt -= pagePosition.x
        }
        return pt
    })

let numUpdates = 0
export const selectLineCollision = (
    strokes: StrokeMap,
    pagePosition: Point,
    pointsSegments: number[][]
): StrokeMap => {
    const target = 5
    const res: StrokeMap = {}
    numUpdates += 1
    if (numUpdates === target) {
        const lastSegment = pointsSegments[pointsSegments.length - 1]
        // create a line between the latest point and 5th last point
        const minIndex = Math.max(lastSegment.length - 2 - 2 * target, 0)
        const line = lastSegment
            .slice(minIndex, minIndex + 2)
            .concat(lastSegment.slice(lastSegment.length - 2))

        numUpdates = 0
        const sel = getHitboxPolygon(
            subPageOffset(line, pagePosition), // compensate page offset in stage
            ERASER_WIDTH
        )

        return matchStrokeCollision(strokes, sel)
    }
    return res
}
