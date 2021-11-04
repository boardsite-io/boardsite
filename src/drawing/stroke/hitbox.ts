import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node"
import { Vector, Polygon, Box, testPolygonPolygon } from "sat"
import { Stroke, Scale, StrokeMap } from "./types"

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
