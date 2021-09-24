import { KonvaEventObject, Node, NodeConfig } from "konva/types/Node"
import { Vector, Polygon, Box, testPolygonPolygon } from "sat"
import { Stroke } from "./types"
import { SET_TR_NODES } from "../../redux/slice/drawcontrol"
import store from "../../redux/store"

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
    e: KonvaEventObject<MouseEvent>
): void {
    const selectedIds = matchStrokeCollision(
        stroke.pageId,
        getSelectionPolygon(stroke.points)
    )
    const selectedShapes: Node<NodeConfig>[] = []
    e.target
        .getParent()
        ?.find(`.${stroke.pageId}`)
        .toArray()
        .forEach((element: Node<NodeConfig>) => {
            if (selectedIds[element.attrs.id]) {
                selectedShapes.push(element)
            }
        })
    store.dispatch(SET_TR_NODES(selectedShapes))
}
