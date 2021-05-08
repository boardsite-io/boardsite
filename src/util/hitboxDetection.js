import SAT from "sat"
import { toolType } from "../constants"

const V = SAT.Vector
// const C = SAT.Circle
const P = SAT.Polygon

export function getHitbox(x1, y1, x2, y2, strokeWidth, scaleX, scaleY) {
    const dx = x2 - x1
    const dy = y2 - y1
    let dxw
    let dyw
    if (!dy) {
        dxw = 0
        dyw = strokeWidth / 2
    } else if (!dx) {
        dxw = strokeWidth / 2
        dyw = 0
    } else {
        const ratio = dx / dy
        dxw = Math.sqrt((strokeWidth / 2) ** 2 / (1 + ratio ** 2))
        dyw = dxw * ratio
    }

    // compensate the effect of the scale on the width
    dxw *= scaleX
    dyw *= scaleY

    // calc vertices
    const v1 = { x: x1 - dxw, y: y1 + dyw }
    const v2 = { x: x2 - dxw, y: y2 + dyw }
    const v3 = { x: x2 + dxw, y: y2 - dyw }
    const v4 = { x: x1 + dxw, y: y1 - dyw }
    const hitbox = { v1, v2, v3, v4 }
    return hitbox
}

// calc the hitboxes of each segment of a stroke with the appropriate width
export function getHitboxes(pageStrokes) {
    const strokeHitboxes = {}
    Object.keys(pageStrokes).forEach((strokeId) => {
        const stroke = pageStrokes[strokeId]
        const strokePoints = [...stroke.points]

        // get hitbox(es) of current stroke
        const strokeIdHitboxes = []
        switch (stroke.type) {
            case toolType.PEN:
                // compensate for the scale and offset
                for (let i = 0; i < strokePoints.length; i += 2) {
                    strokePoints[i] = strokePoints[i] * stroke.scaleX + stroke.x
                    strokePoints[i + 1] =
                        strokePoints[i + 1] * stroke.scaleY + stroke.y
                }

                // get hitboxes of all segments of the current stroke
                for (let i = 0; i < strokePoints.length - 2; i += 2) {
                    const x1 = strokePoints[i]
                    const y1 = strokePoints[i + 1]
                    const x2 = strokePoints[i + 2]
                    const y2 = strokePoints[i + 3]
                    const hitbox = getHitbox(
                        x1,
                        y1,
                        x2,
                        y2,
                        stroke.style.width,
                        stroke.scaleX,
                        stroke.scaleY
                    )
                    strokeIdHitboxes.push(hitbox)
                }
                break
            case toolType.LINE:
                // compensate for the scale and offset
                strokePoints[0] = strokePoints[0] * stroke.scaleX + stroke.x
                strokePoints[1] = strokePoints[1] * stroke.scaleY + stroke.y
                strokePoints[2] = strokePoints[2] * stroke.scaleX + stroke.x
                strokePoints[3] = strokePoints[3] * stroke.scaleY + stroke.y

                strokeIdHitboxes.push(
                    getHitbox(
                        strokePoints[0],
                        strokePoints[1],
                        strokePoints[2],
                        strokePoints[3],
                        stroke.style.width,
                        stroke.scaleX,
                        stroke.scaleY
                    )
                )
                break
            case toolType.RECTANGLE:
                strokePoints[2] =
                    stroke.x +
                    (strokePoints[2] - strokePoints[0]) * stroke.scaleX
                strokePoints[3] =
                    stroke.y +
                    (strokePoints[3] - strokePoints[1]) * stroke.scaleY
                strokePoints[0] = stroke.x
                strokePoints[1] = stroke.y
                strokeIdHitboxes.push(
                    getHitbox(
                        strokePoints[0],
                        strokePoints[1],
                        strokePoints[0],
                        strokePoints[3],
                        stroke.style.width,
                        stroke.scaleX,
                        stroke.scaleY
                    )
                )
                strokeIdHitboxes.push(
                    getHitbox(
                        strokePoints[0],
                        strokePoints[3],
                        strokePoints[2],
                        strokePoints[3],
                        stroke.style.width,
                        stroke.scaleX,
                        stroke.scaleY
                    )
                )
                strokeIdHitboxes.push(
                    getHitbox(
                        strokePoints[2],
                        strokePoints[3],
                        strokePoints[2],
                        strokePoints[1],
                        stroke.style.width,
                        stroke.scaleX,
                        stroke.scaleY
                    )
                )
                strokeIdHitboxes.push(
                    getHitbox(
                        strokePoints[2],
                        strokePoints[1],
                        strokePoints[0],
                        strokePoints[1],
                        stroke.style.width,
                        stroke.scaleX,
                        stroke.scaleY
                    )
                )
                break
            case toolType.CIRCLE:
                // TODO
                break
            default:
                break
        }

        strokeHitboxes[strokeId] = strokeIdHitboxes
    })
    return strokeHitboxes
}

export function getSelectionHitbox(x1, y1, x2, y2) {
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)
    const v1 = { x: minX, y: minY }
    const v2 = { x: minX, y: maxY }
    const v3 = { x: maxX, y: maxY }
    const v4 = { x: maxX, y: minY }
    const selectionHitbox = { v1, v2, v3, v4 }
    return selectionHitbox
}

export function getSelectedIds(strokes, x1, y1, x2, y2) {
    const selectionHitbox = getSelectionHitbox(x1, y1, x2, y2)
    const strokeHitboxes = getHitboxes(strokes)

    const selectionHitboxPolygon = new P(new V(0, 0), [
        new V(selectionHitbox.v1.x, selectionHitbox.v1.y),
        new V(selectionHitbox.v2.x, selectionHitbox.v2.y),
        new V(selectionHitbox.v3.x, selectionHitbox.v3.y),
        new V(selectionHitbox.v4.x, selectionHitbox.v4.y),
    ])
    const selectedStrokeIds = []
    Object.keys(strokeHitboxes).forEach((strokeId) => {
        const hitboxes = strokeHitboxes[strokeId]
        for (let i = 0; i < hitboxes.length; i += 1) {
            const hitbox = hitboxes[i]
            const hitboxPolygon = new P(new V(0, 0), [
                new V(hitbox.v1.x, hitbox.v1.y),
                new V(hitbox.v2.x, hitbox.v2.y),
                new V(hitbox.v3.x, hitbox.v3.y),
                new V(hitbox.v4.x, hitbox.v4.y),
            ])
            const idHasCollided = SAT.testPolygonPolygon(
                hitboxPolygon,
                selectionHitboxPolygon
            )
            if (idHasCollided) {
                selectedStrokeIds.push(strokeId) // add id to selected ids array
                break // current id has a collision => no need to check rest of stroke for collisions
            }
        }
    })
    return selectedStrokeIds
}
