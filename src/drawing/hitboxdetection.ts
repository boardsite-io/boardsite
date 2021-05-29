import { Node, NodeConfig } from "konva/types/Node"
// import SAT from "sat"
// import { toolType } from "../constants"
// import store from "../redux/store"
// import {
//     Hitbox,
//     Stroke,
//     StrokeHitbox,
//     StrokeMap,
//     LayerRefType,
//     TrRefType,
// } from "../types"

// const V = SAT.Vector
// const P = SAT.Polygon

// function getHitbox(
//     x1: number,
//     y1: number,
//     x2: number,
//     y2: number,
//     strokeWidth: number,
//     scaleX: number,
//     scaleY: number
// ): Hitbox {
//     const dx = x2 - x1
//     const dy = y2 - y1
//     let dxw
//     let dyw
//     if (!dy) {
//         dxw = 0
//         dyw = strokeWidth / 2
//     } else if (!dx) {
//         dxw = strokeWidth / 2
//         dyw = 0
//     } else {
//         const ratio = dx / dy
//         dxw = Math.sqrt((strokeWidth / 2) ** 2 / (1 + ratio ** 2))
//         dyw = dxw * ratio
//     }

//     // compensate the effect of the scale on the width
//     dxw *= scaleX
//     dyw *= scaleY

//     // calc vertices
//     const v1 = { x: x1 - dxw, y: y1 + dyw }
//     const v2 = { x: x2 - dxw, y: y2 + dyw }
//     const v3 = { x: x2 + dxw, y: y2 - dyw }
//     const v4 = { x: x1 + dxw, y: y1 - dyw }
//     const hitbox = { v1, v2, v3, v4 }
//     return hitbox
// }

// // calc the hitboxes of each segment of a stroke with the appropriate width
// function getHitboxes(pageStrokes: StrokeMap): StrokeHitbox {
//     const strokeHitboxes: StrokeHitbox = {}

//     Object.keys(pageStrokes).forEach((strokeId) => {
//         const stroke = pageStrokes[strokeId]
//         const strokePoints = [...stroke.points]

//         // get hitbox(es) of current stroke
//         const strokeIdHitboxes: Hitbox[] = []
//         switch (stroke.type) {
//             case toolType.PEN:
//                 getPenHitbox(stroke, strokePoints, strokeIdHitboxes)
//                 break
//             case toolType.LINE:
//                 getLineHitbox(stroke, strokePoints, strokeIdHitboxes)
//                 break
//             case toolType.RECTANGLE:
//                 getRectangleHitbox(stroke, strokePoints, strokeIdHitboxes)
//                 break
//             case toolType.CIRCLE:
//                 getCircleHitbox(stroke, strokePoints, strokeIdHitboxes)
//                 break
//             default:
//                 break
//         }
//         // add the hitbox(es) of current shape
//         strokeHitboxes[strokeId] = strokeIdHitboxes
//     })
//     return strokeHitboxes
// }

// function getPenHitbox(
//     stroke: Stroke,
//     strokePoints: number[],
//     strokeIdHitboxes: Hitbox[]
// ) {
//     // compensate for the scale and offset
//     for (let i = 0; i < strokePoints.length; i += 2) {
//         strokePoints[i] = strokePoints[i] * stroke.scaleX + stroke.x
//         strokePoints[i + 1] = strokePoints[i + 1] * stroke.scaleY + stroke.y
//     }

//     // get hitboxes of all segments of the current stroke
//     for (let i = 0; i < strokePoints.length - 2; i += 2) {
//         const hitbox = getHitbox(
//             strokePoints[i],
//             strokePoints[i + 1],
//             strokePoints[i + 2],
//             strokePoints[i + 3],
//             stroke.style.width,
//             stroke.scaleX,
//             stroke.scaleY
//         )
//         strokeIdHitboxes.push(hitbox)
//     }
// }

// function getLineHitbox(
//     stroke: Stroke,
//     strokePoints: number[],
//     strokeIdHitboxes: Hitbox[]
// ) {
//     // compensate for the scale and offset
//     strokePoints[0] = strokePoints[0] * stroke.scaleX + stroke.x
//     strokePoints[1] = strokePoints[1] * stroke.scaleY + stroke.y
//     strokePoints[2] = strokePoints[2] * stroke.scaleX + stroke.x
//     strokePoints[3] = strokePoints[3] * stroke.scaleY + stroke.y

//     strokeIdHitboxes.push(
//         getHitbox(
//             strokePoints[0],
//             strokePoints[1],
//             strokePoints[2],
//             strokePoints[3],
//             stroke.style.width,
//             stroke.scaleX,
//             stroke.scaleY
//         )
//     )
// }

// function getRectangleHitbox(
//     stroke: Stroke,
//     strokePoints: number[],
//     strokeIdHitboxes: Hitbox[]
// ) {
//     const x1 = stroke.x
//     const y1 = stroke.y
//     const x2 = stroke.x + (strokePoints[2] - strokePoints[0]) * stroke.scaleX
//     const y2 = stroke.y + (strokePoints[3] - strokePoints[1]) * stroke.scaleY
//     const w = stroke.style.width
//     strokeIdHitboxes.push(
//         getHitbox(x1, y1, x1, y2, w, stroke.scaleX, stroke.scaleY)
//     )
//     strokeIdHitboxes.push(
//         getHitbox(x1, y2, x2, y2, w, stroke.scaleX, stroke.scaleY)
//     )
//     strokeIdHitboxes.push(
//         getHitbox(x2, y2, x2, y1, w, stroke.scaleX, stroke.scaleY)
//     )
//     strokeIdHitboxes.push(
//         getHitbox(x2, y1, x1, y1, w, stroke.scaleX, stroke.scaleY)
//     )
// }

// function getCircleHitbox(
//     stroke: Stroke,
//     strokePoints: number[],
//     strokeIdHitboxes: Hitbox[]
// ) {
//     const rad = {
//         x: (strokePoints[2] - strokePoints[0]) / 2,
//         y: (strokePoints[3] - strokePoints[1]) / 2,
//     }
//     const x1 = stroke.x - rad.x * stroke.scaleX
//     const y1 = stroke.y - rad.y * stroke.scaleY
//     const x2 = stroke.x + rad.x * stroke.scaleX
//     const y2 = stroke.y + rad.y * stroke.scaleY
//     const w = stroke.style.width
//     strokeIdHitboxes.push(
//         getHitbox(x1, y1, x1, y2, w, stroke.scaleX, stroke.scaleY)
//     )
//     strokeIdHitboxes.push(
//         getHitbox(x1, y2, x2, y2, w, stroke.scaleX, stroke.scaleY)
//     )
//     strokeIdHitboxes.push(
//         getHitbox(x2, y2, x2, y1, w, stroke.scaleX, stroke.scaleY)
//     )
//     strokeIdHitboxes.push(
//         getHitbox(x2, y1, x1, y1, w, stroke.scaleX, stroke.scaleY)
//     )
// }

// function getSelectionHitbox([x1, y1, x2, y2]: number[]): Hitbox {
//     const minX = Math.min(x1, x2)
//     const maxX = Math.max(x1, x2)
//     const minY = Math.min(y1, y2)
//     const maxY = Math.max(y1, y2)
//     const v1 = { x: minX, y: minY }
//     const v2 = { x: minX, y: maxY }
//     const v3 = { x: maxX, y: maxY }
//     const v4 = { x: maxX, y: minY }
//     const selectionHitbox = { v1, v2, v3, v4 }
//     return selectionHitbox
// }

// function getSelectedIds({ pageId, points }: Stroke): { [id: string]: boolean } {
//     const { strokes } = store.getState().boardControl.pageCollection[pageId]
//     const selectionHitbox = getSelectionHitbox(points)
//     const strokeHitboxes = getHitboxes(strokes)

//     const selectionHitboxPolygon = new P(new V(0, 0), [
//         new V(selectionHitbox.v1.x, selectionHitbox.v1.y),
//         new V(selectionHitbox.v2.x, selectionHitbox.v2.y),
//         new V(selectionHitbox.v3.x, selectionHitbox.v3.y),
//         new V(selectionHitbox.v4.x, selectionHitbox.v4.y),
//     ])
//     const selectedStrokeIds: { [id: string]: boolean } = {}
//     Object.keys(strokeHitboxes).forEach((strokeId) => {
//         const hitboxes = strokeHitboxes[strokeId]
//         for (let i = 0; i < hitboxes.length; i += 1) {
//             const hitbox = hitboxes[i]
//             const hitboxPolygon = new P(new V(0, 0), [
//                 new V(hitbox.v1.x, hitbox.v1.y),
//                 new V(hitbox.v2.x, hitbox.v2.y),
//                 new V(hitbox.v3.x, hitbox.v3.y),
//                 new V(hitbox.v4.x, hitbox.v4.y),
//             ])
//             const idHasCollided = SAT.testPolygonPolygon(
//                 hitboxPolygon,
//                 selectionHitboxPolygon
//             )
//             if (idHasCollided) {
//                 selectedStrokeIds[strokeId] = true // add id to selected ids array
//                 break // current id has a collision => no need to check rest of stroke for collisions
//             }
//         }
//     })
//     return selectedStrokeIds
// }

// export function setSelectedShapes(
//     stroke: Stroke,
//     trRef: TrRefType,
//     layerRef: LayerRefType
// ): void {
//     // const [x1, y1, x2, y2] = points
//     const selectedIds = getSelectedIds(stroke)
//     const selectedShapes: Node<NodeConfig>[] = []
//     layerRef?.current
//         ?.find(".shape")
//         .toArray()
//         .forEach((element: Node<NodeConfig>) => {
//             if (selectedIds[element.attrs.id]) {
//                 selectedShapes.push(element)
//             }
//         })
//     trRef?.current?.nodes(selectedShapes)
// }
