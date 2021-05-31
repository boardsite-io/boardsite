import { KonvaEventObject, Node, NodeConfig } from "konva/types/Node"
import { Vector, Polygon, Box, testPolygonPolygon } from "sat"
import store from "../../../redux/store"
import { Stroke, TrRefType } from "../../../types"

export function getHitboxPolygon(
    [x1, y1, x2, y2]: number[],
    { style, scaleX, scaleY }: Stroke
): Polygon {
    const dx = x2 - x1
    const dy = y2 - y1
    let dxw
    let dyw
    if (!dy) {
        dxw = 0
        dyw = style.width / 2
    } else if (!dx) {
        dxw = style.width / 2
        dyw = 0
    } else {
        const ratio = dx / dy
        dxw = Math.sqrt((style.width / 2) ** 2 / (1 + ratio ** 2))
        dyw = dxw * ratio
    }

    // compensate the effect of the scale on the width
    dxw *= scaleX || 1
    dyw *= scaleY || 1

    // calc vertices
    return new Polygon(new Vector(), [
        new Vector(x1 - dxw, y1 + dyw),
        new Vector(x2 - dxw, y2 + dyw),
        new Vector(x2 + dxw, y2 - dyw),
        new Vector(x1 + dxw, y1 - dyw),
    ])
}

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
    pageId: string,
    selection: Polygon
): { [id: string]: boolean } {
    const { strokes } = store.getState().boardControl.pageCollection[pageId]
    const result: { [id: string]: boolean } = {}
    Object.keys(strokes).forEach((id) => {
        // test each hitbox segment
        for (let i = 0; i < (strokes[id].hitboxes ?? []).length; i += 1) {
            if (
                testPolygonPolygon((strokes[id].hitboxes ?? [])[i], selection)
            ) {
                result[id] = true
                break
            }
        }
    })
    return result
}

export function setSelectedShapes(
    stroke: Stroke, // selection rectangle
    trRef: TrRefType,
    e: KonvaEventObject<MouseEvent>
): void {
    const selectedIds = matchStrokeCollision(
        stroke.pageId,
        getSelectionPolygon(stroke.points)
    )
    const selectedShapes: Node<NodeConfig>[] = []
    e.target
        .getParent()
        ?.find(".shape")
        .toArray()
        .forEach((element: Node<NodeConfig>) => {
            if (selectedIds[element.attrs.id]) {
                selectedShapes.push(element)
            }
        })
    trRef?.current?.nodes(selectedShapes)
}
