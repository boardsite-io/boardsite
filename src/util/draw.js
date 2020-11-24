

let imageData;
let isMouseDown = false;
let sampleCount = 0;
let lastX = -1;
let lastY = -1;
let stroke = [];
let isEraser = false;

export function handleCanvasMouseDown(e, canvasRef) {
    if (e.type === "touchstart"){
        e = e.changedTouches[0];
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if(e.button === 0){ // left-click
        isEraser = false;
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Save canvas state
    } else if(e.button === 2){ // right-click
        isEraser = true;
    }

    isMouseDown = true;
    sampleCount = 1;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    stroke = [x, y];

    lastX = x;
    lastY = y;
}

export function handleCanvasMouseMove(e, canvasRef) {
    if (isMouseDown) {
        let minSampleCount = 8;
        if (e.type === "touchmove"){
            e = e.touches[0];
            minSampleCount = 3; // more precision for stylus
        }
        sampleCount += 1;
        const canvas = canvasRef.current;
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let moveDist = Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2); // Quadratic distance moved from last registered point

        if (moveDist > 100 || sampleCount > minSampleCount) {
            sampleCount = 1;
            stroke.push(x, y);
            const ctx = canvas.getContext('2d');
            if(!isEraser){
                drawLine(lastX, lastY, x, y, ctx);
            }
            lastX = x;
            lastY = y;
        }
    }
}

export function handleCanvasMouseUp(e, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setNeedsRedraw) {
    if (!isMouseDown) { return; } // Ignore reentering
    isMouseDown = false;
    lastX = -1;
    lastY = -1;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rect = canvas.getBoundingClientRect();
    if (e.type !== "touchend" && e.type !== "touchcancel"){
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        stroke.push(x, y);
    }
    stroke = getCurvePoints(stroke, 0.5);
    stroke = stroke.map(x => Math.round(x * 1e3) / 1e3);
    // generate unique id
    let strokeid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4) + Date.now().toString(36).substr(4);
    let strokeObject = { 
        id: strokeid, 
        type: "stroke", 
        line_width: ctx.lineWidth, 
        color: ctx.strokeStyle, 
        position: stroke, 
    };

    if(!isEraser){
        // Delete livestroke lines and restroke interpolated and potentially buffered strokes
        ctx.putImageData(imageData, 0, 0);
        drawCurve(ctx, stroke);
        updateStrokeCollection(setStrokeCollection, strokeObject, wsRef);
        addHitbox(setHitboxCollection, strokeObject);
    } else{
        eraser(setHitboxCollection, setStrokeCollection, strokeObject, setNeedsRedraw);
    }
}

export function handleCanvasMouseLeave(e, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setNeedsRedraw) {
    handleCanvasMouseUp(e, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setNeedsRedraw);
}

export function updateStrokeCollection(setStrokeCollection, strokeObject, wsRef) {
    // Add stroke to strokeCollection
    setStrokeCollection((prev) => {
        let res = { ...prev };
        res[strokeObject.id] = strokeObject;
        // console.log(res[strokeObject.id].position);
        return res;
    });

    // let colorInt = parseInt(ctx.strokeStyle.substring(1), 16);
    if (wsRef.current !== null) {
        wsRef.current.send(JSON.stringify([strokeObject]));
    }
    else {
        console.log("socket not open");
    }
}

/**
 * 
 * @param {function} setHitboxCollection state setting function
 * @param {object} strokeObject stroke object to set hitbox from
 * @param {[number: width, number: height]} boardResolution canvas resolution in pixels
 * @param {number} hitboxAccuracy accuracy in pixels
 */
export function addHitbox(setHitboxCollection, strokeObject, boardResolution, hitboxAccuracy) {
    let positions = strokeObject.position.splice(0);
    let id = strokeObject.id;
    let pointSkipFactor = 4;
    
    setHitboxCollection((prev) => {
        let _prev = {...prev}
        for (let i = 0; i < positions.length; i += 2*pointSkipFactor) {
            let x = Math.round(positions[i]);
            let y = Math.round(positions[i + 1]);
            if([x,y] in _prev){ // other ID(s) in this hitbox position
                let tmp = _prev[[x,y]];
                if(!tmp.includes(id)){ // prevent double entries of same id
                    tmp.push(id);
                    _prev[[x,y]] = tmp;
                }
            } else{ // no other ID in this hitbox position
                _prev[[x,y]] = [id];
            }
        }
        return _prev;
    });
}

export function eraser(setHitboxCollection, setStrokeCollection, strokeObject, setNeedsRedraw, boardResolution, hitboxAccuracy) {
    let positions = strokeObject.position.splice(0);
    let pointSkipFactor = 4;
    let idsToDelete = [];

    setHitboxCollection((prev) => {
        let _prev = {...prev}
        for (let i = 0; i < positions.length; i += 2*pointSkipFactor) {
            let x = Math.round(positions[i]);
            let y = Math.round(positions[i + 1]);
            if([x,y] in _prev){ // IDs in this hitbox position
                let tmp = _prev[[x,y]];
                for (let i = 0; i < tmp.length; i++) {
                    let id = tmp[i];
                    if(!idsToDelete.includes(id)){
                        idsToDelete.push(id);
                    }
                }
            }
        }
        // TODO: REMOVE DELETED ID HITBOXES FROM HITBOXCOLLECTION
        return _prev;
    });

    // erase id's strokes from collection
    setStrokeCollection((prev) => {
        let _prev = {...prev}
        for (let i = 0; i < idsToDelete.length; i++) {
            delete _prev[idsToDelete[i]];
        }
        return _prev;
    });

    setNeedsRedraw(x => x + 1); // trigger redraw
}

// draw line
export function drawLine(x1, y1, x2, y2, ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// draw rectangle with background
// function drawFillRect(x, y, w, h, color) {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     ctx.beginPath();
//     ctx.fillStyle = color;
//     ctx.fillRect(x, y, w, h);
// }

export function getCurvePoints(pts, tension, isClosed, numOfSegments) {
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
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]);	//copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]);	//copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i = 2; i < (_pts.length - 4); i += 2) {
        for (t = 0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
            t2x = (_pts[i + 4] - _pts[i]) * tension;

            t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
            t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
            c4 = Math.pow(st, 3) - Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }
    return res;
}

// DRAWING FUNCTIONS FROM STACKOVERFLOW
export function drawCurve(ctx, ptsa, showPoints) {
    ctx.beginPath();
    drawLines(ctx, ptsa);
    if (showPoints) {
        ctx.beginPath();
        for (var i = 0; i < ptsa.length - 1; i += 2)
            ctx.rect(ptsa[i] - 2, ptsa[i + 1] - 2, 4, 4);
    }
    ctx.stroke();
}



export function drawLines(ctx, pts) {
    ctx.moveTo(pts[0], pts[1]);
    for (var i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
}