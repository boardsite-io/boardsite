import store from "../../redux/store.js"
import { actAddStroke } from "../../redux/slice/boardcontrol.js"
import {
    actStartLiveStroke,
    actSetLiveStrokePos,
    actEndLiveStroke,
} from "../../redux/slice/drawcontrol.js"
import { handleStrokeMouseEnter } from "./eventlistener.js"
import { Line } from "react-konva"
import { tool } from "../../constants.js"
// import * as constant from '../constants.js';

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * @param {{stroke: {}}} props
 */
export function StrokeShape(props) {
    let shape
    switch (props.stroke.type) {
        case tool.PEN:
            shape = (
                <Line
                    points={props.stroke.points}
                    stroke={props.stroke.style.color}
                    strokeWidth={props.stroke.style.width}
                    tension={0.5}
                    lineCap="round"
                    onMouseEnter={(e) =>
                        handleStrokeMouseEnter(e, props.stroke)
                    }
                />
            )
            break
        default:
            shape = <></>
    }

    return shape
}

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} position
 */
export function startLiveStroke(position, pageId) {
    store.dispatch(
        actStartLiveStroke({
            page_id: pageId,
            points: [position.x, position.y],
        })
    )
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} position
 */
export function moveLiveStroke(position) {
    const liveStrokePts = store.getState().drawControl.liveStroke.points

    store.dispatch(
        actSetLiveStrokePos([...liveStrokePts, position.x, position.y])
    )
}

/**
 * Generate API serialized stroke object, draw & save it to redux store
 * @param {*} pageId
 */
export async function registerLiveStroke(position) {
    let liveStroke = store.getState().drawControl.liveStroke

    // empty livestrokes e.g. rightmouse eraser
    if (liveStroke.points.length === 0) {
        return
    }
    if (liveStroke.type === tool.ERASER) {
        return
    }

    moveLiveStroke(position)

    //const ptsInterp = getPoints(liveStroke.points, 0.5)

    liveStroke = {
        ...liveStroke,
        id:
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 4) + Date.now().toString(36).substr(4),
        //points: ptsInterp,
    }
    
    // add stroke to collection
    store.dispatch(actAddStroke(liveStroke))

    // clear livestroke
    store.dispatch(actEndLiveStroke())
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
        _pts.unshift(pts[pts.length - 2])
        _pts.unshift(pts[pts.length - 1])
        _pts.unshift(pts[pts.length - 2])
        _pts.push(pts[0])
        _pts.push(pts[1])
    } else {
        _pts.unshift(pts[1]) //copy 1. point and insert at beginning
        _pts.unshift(pts[0])
        _pts.push(pts[pts.length - 2]) //copy last point and append
        _pts.push(pts[pts.length - 1])
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i = 2; i < _pts.length - 4; i += 2) {
        for (t = 0; t <= numOfSegments; t++) {
            // calc tension vectors
            t1x = (_pts[i + 2] - _pts[i - 2]) * tension
            t2x = (_pts[i + 4] - _pts[i]) * tension

            t1y = (_pts[i + 3] - _pts[i - 1]) * tension
            t2y = (_pts[i + 5] - _pts[i + 1]) * tension

            // calc step
            st = t / numOfSegments

            // calc cardinals
            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2)
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st
            c4 = Math.pow(st, 3) - Math.pow(st, 2)

            // calc x and y cords with common control vectors
            x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x
            y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y

            //store points in array
            res.push(Math.round(x * 1e2) / 1e2, Math.round(y * 1e2) / 1e2)
        }
    }
    return res
}
