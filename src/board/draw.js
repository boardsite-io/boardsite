// import * as proc from './processing.js';
// import * as hbx from './hitbox.js';
import * as constant from '../constants.js';

/**
 * Get the canvas element
 * @param {{id: string, ref: any}} arg 
 */
export function getCanvas(arg) {
    const { id, ref } = arg;

    if (ref !== undefined) {
        return ref.current;
    } else if (id !== undefined) {
        return document.getElementById(id);
    }
}

/**
 * Creates a new canvas context with given style
 * @param {*} canvas 
 * @param {*} style 
 */
export function setStyleCtx(canvas, style) {
    const ctx = canvas.getContext('2d');
    const { width, color } = style;

    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    return ctx;
}

export function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, constant.CANVAS_WIDTH, constant.CANVAS_HEIGHT);
}

export function redraw(canvas) {
    clearCanvas(canvas);

    // setBoardInfo((prev) => {
    //     Object.keys(prev.strokeCollection[pageId]).forEach((key) => {
    //         let strokeObject = prev.strokeCollection[pageId][key];
    //         return drawCurve(ctx, strokeObject);
    //     })
    //     return prev;
    // });
}

export function eraser(setBoardInfo, strokeObject, wsRef, canvasRef) {
    // let positions = strokeObject.position.slice();
    // let idsToDelete = {};
    // let strokeObjectArray = [];
    // let pageId = strokeObject.page_id;

    // setBoardInfo((prev) => {
    //     let pointSkipFactor = 16; // only check every p-th (x,y) position to reduce computational load
    //     let quadMinPixDist = 100; // quadratic minimum distance between points to be valid for hitbox calculation
    //     let hitbox = hbx.getHitbox(positions, pointSkipFactor, quadMinPixDist, strokeObject.line_width);

    //     if (prev.hitboxCollection[pageId] === undefined) {
    //         return prev;
    //     }
    //     // get all ids from the eraser hitboxes
    //     for (let i = 0; i < hitbox.length; i++) {
    //         let xy = hitbox[i];
    //         if (prev.hitboxCollection[pageId][xy] !== undefined) { // there are IDs in this hitbox position
    //             Object.keys(prev.hitboxCollection[pageId][xy]).forEach((id) => { // for each ID in this hitbox position
    //                 idsToDelete[id] = true;
    //             })
    //         }
    //     }

    //     // formatting for processing function
    //     Object.keys(idsToDelete).forEach((id) => {
    //         strokeObject = {};
    //         strokeObject["id"] = id;
    //         strokeObject["type"] = "delete";
    //         strokeObject["page_id"] = pageId;
    //         strokeObjectArray.push(strokeObject);
    //     })
    //     return prev;
    // });

    // if (strokeObjectArray.length !== 0) {
    //     proc.processStrokes(strokeObjectArray, "eraser", setBoardInfo, wsRef, canvasRef);
    // }
}

export function drawStroke(canvas, strokeObject) {
    drawLines(canvas, strokeObject.style, strokeObject.points);
}

export function drawLines(canvas, style, pts) {
    const ctx = setStyleCtx(canvas, style);

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    // Rounded ends
    drawCircle(canvas, style,{ ...pts[0], rad: ctx.lineWidth/2 }, true);
    drawCircle(canvas, style, { ...pts[pts.length-1], rad: ctx.lineWidth/2}, true);
}

export function drawTriangle(canvas, style, pts, fill=false) {
    const ctx = setStyleCtx(canvas, style);

    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    ctx.lineTo(pts[2], pts[3]);
    ctx.lineTo(pts[4], pts[5]);
    if (fill) {
        ctx.fill();
    } else {
        ctx.closePath();
        ctx.stroke();
    }
}

// // draw line
// export function drawLine(x1, y1, x2, y2, ctx) {
//     ctx.beginPath();
//     ctx.moveTo(x1, y1);
//     ctx.lineTo(x2, y2);
//     ctx.stroke();
// }

// // draw rectangle with background
// export function drawFillRect(x, y, w, h, ctx) {
//     ctx.beginPath();
//     ctx.fillRect(x, y, w, h);
// }

export function drawCircle(canvas, style, pos, fill=false) {
    const { x, y, rad } = pos;
    const ctx = setStyleCtx(canvas, style);

    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2*Math.PI);
    if (fill) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}