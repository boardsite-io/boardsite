import store from "../../redux/store.js"
import { actAddStroke } from "../../redux/slice/boardcontrol.js"
import * as draw from "./draw.js"
// import * as constant from '../constants.js';

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} canvas
 * @param {*} tool
 * @param {*} position
 */
export function startStroke(canvas, tool, position) {}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} canvas
 * @param {*} prevPts
 * @param {*} position
 */
export function moveStroke(canvas, prevPts) {
    const style = store.getState().drawControl.style

    // draw the latest points
    draw.drawLines(canvas, style, prevPts.slice(prevPts.length - 2))
}

/**
 * Generate API serialized stroke object, draw & save it to redux store
 * @param {{pageId: string, type: string, style:
 * {color: string, width: number},
 * position: [{x: number, y: number}]} curve
 */
export async function registerStroke(canvas, curve) {
    const { pageId, type, style, points, activeTool } = curve
    const ptsInterp = getPoints(points, 0.5)
    const stroke = {
        id:
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 4) + Date.now().toString(36).substr(4),
        page_id: pageId,
        type: type,
        style: style,
        points: ptsInterp,
    }

    const hitboxes = getHitbox(points, style, canvas)
    if (activeTool === "eraser") {
    } else {
        draw.drawStroke(canvas, stroke)
        store.dispatch(actAddStroke({ stroke: stroke, hitbox: hitboxes }))
    }
}

/**
 * Check which hitboxes collide with the eraser hitboxes
 * @param {String} pageId
 * @param {Array} eraserHitboxes
 */
function getCollision(pageId, eraserHitboxes) {
    // let collisionIds = []
    // let collisionHitboxes = [] // FOR DEBUGGING / VISUALIZATION
    // let hitboxes = {
    //     ...store.getState().boardControl.pageCollection[pageId].hitboxes,
    // }
    // eraserHitboxes.forEach((eraserHitbox) => {
    //     const v1 = eraserHitbox.v1,
    //         v2 = eraserHitbox.v2,
    //         v3 = eraserHitbox.v3,
    //         v4 = eraserHitbox.v4
    //     const eraserHitboxPolygon = new P(new V(0, 0), [
    //         new V(v1.x, v1.y),
    //         new V(v2.x, v2.y),
    //         new V(v3.x, v3.y),
    //         new V(v4.x, v4.y),
    //     ])
    //     const keys = Object.keys(hitboxes)
    //     let idHasCollided = false
    //     for (let j = 0; j < keys.length; j++) {
    //         const id = keys[j]
    //         const hitboxFromId = hitboxes[id]
    //         for (let i = 0; i < hitboxFromId.length; i++) {
    //             const hitbox = hitboxFromId[i]
    //             const v1 = hitbox.v1,
    //                 v2 = hitbox.v2,
    //                 v3 = hitbox.v3,
    //                 v4 = hitbox.v4
    //             const hitboxPolygon = new P(new V(0, 0), [
    //                 new V(v1.x, v1.y),
    //                 new V(v2.x, v2.y),
    //                 new V(v3.x, v3.y),
    //                 new V(v4.x, v4.y),
    //             ])
    //             idHasCollided = SAT.testPolygonPolygon(
    //                 eraserHitboxPolygon,
    //                 hitboxPolygon
    //             )
    //             if (idHasCollided) {
    //                 collisionHitboxes.push(hitbox) // add hitbox for visualization / debug
    //                 collisionIds.push(id) // add id to collided ids array
    //                 delete hitboxes[id] // remove hitboxes from id to avoid double detections and save time
    //                 break // current id has a collision => no need to check rest of stroke for collisions
    //             }
    //         }
    //         if (idHasCollided) {
    //             break
    //         }
    //     }
    // })
    // return { collisionHitboxes: collisionHitboxes, collisionIds: collisionIds }
}

/**
 * Calculate hitbox from the non-interpolated points
 * @param {Array} points
 * @param {Object} style
 * @param {Canvas} canvas
 */
function getHitbox(points, style, canvas) {
    let hitboxes = []
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i],
            p2 = points[i + 1]

        let dx = p2.x - p1.x
        let dy = p2.y - p1.y
        let dxw, dyw
        if (!dy) {
            dxw = 0
            dyw = style.width / 2
        } else if (!dx) {
            dxw = style.width / 2
            dyw = 0
        } else {
            let ratio = dx / dy
            dxw = Math.sqrt(
                Math.pow(style.width / 2, 2) / (1 + Math.pow(ratio, 2))
            )
            dyw = dxw * ratio
        }

        // calc vertices
        let v1 = { x: p1.x - dxw, y: p1.y + dyw },
            v2 = { x: p2.x - dxw, y: p2.y + dyw },
            v3 = { x: p2.x + dxw, y: p2.y - dyw },
            v4 = { x: p1.x + dxw, y: p1.y - dyw }

        let hitboxstyle = { ...style }
        hitboxstyle.width = 2
        hitboxstyle.color = "#f00"
        draw.drawLines(canvas, hitboxstyle, [v1, v2, v3, v4, v1]) // 4debug

        // create hitbox
        // var hitbox = new P(new V(0, 0), [new V(v1.x, v1.y), new V(v2.x, v2.y), new V(v3.x, v3.y), new V(v4.x, v4.y)]);
        const hitbox = { v1: v1, v2: v2, v3: v3, v4: v4 }
        hitboxes.push(hitbox)
    }
    return hitboxes
}

/**
 *
 * @param {[{x: number, y: number}]} pts
 * @param {*} tension
 * @param {*} isClosed
 * @param {*} numOfSegments
 */
export function getPoints(pts, tension, isClosed, numOfSegments) {
    // use input value if provided, or use a default value
    tension = typeof tension != "undefined" ? tension : 0.5
    isClosed = isClosed ? isClosed : false
    numOfSegments = numOfSegments ? numOfSegments : 16

    var _pts = [],
        res = [], // clone array
        x,
        y, // our x,y coords
        t1x,
        t2x,
        t1y,
        t2y, // tension vectors
        c1,
        c2,
        c3,
        c4, // cardinal points
        st,
        t,
        i // steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0)

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1])
        _pts.unshift(pts[pts.length - 1])
        _pts.push(pts[0])
    } else {
        _pts.unshift(pts[0]) //copy 1. point and insert at beginning
        _pts.push(pts[pts.length - 1]) //copy last point and append
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i = 1; i < _pts.length - 2; i++) {
        for (t = 0; t <= numOfSegments; t++) {
            // calc tension vectors
            t1x = (_pts[i + 1].x - _pts[i - 1].x) * tension
            t2x = (_pts[i + 2].x - _pts[i].x) * tension

            t1y = (_pts[i + 1].y - _pts[i - 1].y) * tension
            t2y = (_pts[i + 2].y - _pts[i].y) * tension

            // calc step
            st = t / numOfSegments

            // calc cardinals
            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2)
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st
            c4 = Math.pow(st, 3) - Math.pow(st, 2)

            // calc x and y cords with common control vectors
            x = c1 * _pts[i].x + c2 * _pts[i + 1].x + c3 * t1x + c4 * t2x
            y = c1 * _pts[i].y + c2 * _pts[i + 1].y + c3 * t1y + c4 * t2y

            //store points in array
            res.push({ x: x.toFixed(2), y: y.toFixed(2) })
        }
    }
    return res
}
