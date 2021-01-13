import * as proc from './processing.js';
import * as hbx from './hitbox.js';

export function redraw(pageId, canvasRef, setStrokeCollection) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 2480, 3508);
    let strokeStyle = ctx.strokeStyle;
    let lineWidth = ctx.lineWidth;

    // extract fresh strokecollection
    setStrokeCollection((prev) => {
        let strokeCollection = { ...prev } // copy
        Object.keys(strokeCollection[pageId]).forEach((key) => {
            let strokeObject = strokeCollection[pageId][key];
            return drawCurve(ctx, strokeObject);
        })
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        return prev;
    })
}

export function eraser(setHitboxCollection, setStrokeCollection, setUndoStack, strokeObject, wsRef, canvasRef) {
    let positions = strokeObject.position.slice();
    let idsToDelete = {};
    let strokeObjectArray = [];
    let pageId = strokeObject.page_id;

    setHitboxCollection((prev) => {
        let pointSkipFactor = 16; // only check every p-th (x,y) position to reduce computational load
        let quadMinPixDist = 100; // quadratic minimum distance between points to be valid for hitbox calculation
        let padding = 0;
        let hitbox = hbx.getHitbox(positions, pointSkipFactor, quadMinPixDist, padding);
        let _prev = { ...prev };

        if (_prev[pageId] === undefined) {
            return _prev;
        }
        // get all ids from the eraser hitboxes
        for (let i = 0; i < hitbox.length; i++) {
            let xy = hitbox[i];
            if (_prev[pageId][xy] !== undefined) { // there are IDs in this hitbox position
                Object.keys(_prev[pageId][xy]).forEach((id) => { // for each ID in this hitbox position
                    idsToDelete[id] = true;
                })
            }
        }

        // formatting for processing function
        Object.keys(idsToDelete).forEach((id) => {
            strokeObject = {};
            strokeObject["id"] = id;
            strokeObject["type"] = "delete";
            strokeObject["page_id"] = pageId;
            strokeObjectArray.push(strokeObject);
        })

        return _prev;
    });

    if (strokeObjectArray.length !== 0) {
        proc.processStrokes(strokeObjectArray, "eraser", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
    }
}

// draw line
export function drawLine(x1, y1, x2, y2, ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// draw rectangle with background
export function drawFillRect(x, y, w, h, ctx) {
    ctx.beginPath();
    ctx.fillRect(x, y, w, h);
}

// DRAWING FUNCTIONS FROM STACKOVERFLOW
export function drawCurve(ctx, strokeObject) {
    let points = strokeObject.position;
    ctx.strokeStyle = strokeObject.color;
    ctx.lineWidth = strokeObject.line_width;
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]); // move to the first point
    let i;
    for (i = 2; i < points.length - 4; i = i + 2) {
        var xc = (points[i] + points[i + 2]) / 2;
        var yc = (points[i + 1] + points[i + 3]) / 2;
        ctx.quadraticCurveTo(points[i], points[i + 1], xc, yc);
    }
    console.log(i, points.length);
    ctx.quadraticCurveTo(points[i], points[i + 1], points[i + 2], points[i + 3]); // curve through the last two points
    ctx.stroke();
}
