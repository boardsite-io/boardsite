import store from '../redux/store.js';
import { actAddStroke } from '../redux/slice/boardcontrol.js';
import * as draw from './draw.js';
import * as constant from '../constants.js';

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} canvas 
 * @param {*} tool 
 * @param {*} position 
 */
export function startStroke(canvas, tool, position) {
    const style = store.getState().drawControl.style;

    if (tool === "pen") {
        draw.drawCircle(canvas, { ...position, rad: style.width / 2 }, true);
    }
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} canvas 
 * @param {*} prevPts 
 * @param {*} position 
 * @param {*} sampleCount 
 */
export function moveStroke(canvas, prevPts, position, sampleCount) {
    const style = store.getState().drawControl.style;
    // Quadratic distance moved from last registered point
    const moveDist  = Math.pow(position.x - prevPts[prevPts.length - 1].x, 2)
                    + Math.pow(position.y - prevPts[prevPts.length - 1].y, 2);

    // if (e.type === "touchmove") {
    //     e = e.touches[0];
    //     minSampleCount = 3; // more precision for stylus
    // }

    if (moveDist > 1000 || sampleCount > constant.MIN_SAMPLE_COUNT) {
        prevPts.push(position);
        draw.drawLines(canvas, style, prevPts.slice(prevPts.length - 2));
        // if (activeTool === "pen") {
        // }
        // else { // eraser
        //     strokePoints.push(x, y);
        // }
    }

}

/**
 * Generate API serialized stroke object, draw & save it to redux store
 * @param {{pageId: string, type: string, style: 
    * {color: string, width: number}, 
    * position: [{x: number, y: number}]} curve 
    */
export async function registerStroke(canvas, curve) {
    const { pageId, type, style, points } = curve;
    const ptsInterp = getPoints(points, 0.5);

    const stroke = {
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4)
            + Date.now().toString(36).substr(4),
        page_id: pageId,
        type: type,
        style: style,
        points: ptsInterp,
    };

    draw.drawStroke(canvas, stroke);
    store.dispatch(actAddStroke(stroke));
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
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],	// clone array
        x, y,			// our x,y coords
        t1x, t2x, t1y, t2y,	// tension vectors
        c1, c2, c3, c4,		// cardinal points
        st, t, i;		// steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.push(pts[0]);
    }
    else {
        _pts.unshift(pts[0]);	//copy 1. point and insert at beginning
        _pts.push(pts[pts.length - 1]);	//copy last point and append
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i = 1; i < (_pts.length - 2); i++) {
        for (t = 0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i + 1].x - _pts[i - 1].x) * tension;
            t2x = (_pts[i + 2].x - _pts[i].x) * tension;

            t1y = (_pts[i + 1].y - _pts[i - 1].y) * tension;
            t2y = (_pts[i + 2].y - _pts[i].y) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
            c4 = Math.pow(st, 3) - Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i].x + c2 * _pts[i + 1].x + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i].y + c2 * _pts[i + 1].y + c3 * t1y + c4 * t2y;

            //store points in array
            res.push({ x: x.toFixed(2), y: y.toFixed(2) });
        }
    }
    return res;
}