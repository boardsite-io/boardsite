const SAT = require("sat")

const V = SAT.Vector
// const C = SAT.Circle
const P = SAT.Polygon

export function getHitbox(x1, y1, x2, y2, width) {
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
        const strokePoints = stroke.points
        const strokeWidth = stroke.style.width
        const strokeIdHitboxes = []
        for (let i = 0; i < strokePoints.length - 2; i += 2) {
            const x1 = strokePoints[i]
            const y1 = strokePoints[i + 1]
            const x2 = strokePoints[i + 2]
            const y2 = strokePoints[i + 3]
            const hitbox = getHitbox(x1, y1, x2, y2, strokeWidth)
            strokeIdHitboxes.push(hitbox)
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

export function getSelectedIds(strokeHitboxes, selectionHitbox) {
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
