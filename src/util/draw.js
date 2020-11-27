import * as draw from '../util/drawingengine.js';
import * as hbx from '../util/hitbox.js';

let imageData;
let isMouseDown = false;
let sampleCount = 0;
let lastX = -1;
let lastY = -1;
let stroke = [];
let isEraser = false;

export function handleCanvasMouseDown(e, canvasRef) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (e.type === "touchstart") {
        isEraser = false;
        e = e.changedTouches[0];
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Save canvas state
    }
    else {
        if (e.button === 0) { // left-click
            isEraser = false;
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Save canvas state
        } else if (e.button === 2) { // right-click
            isEraser = true;
        }
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
        if (e.type === "touchmove") {
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
            if (!isEraser) {
                draw.drawLine(lastX, lastY, x, y, ctx);
            }
            lastX = x;
            lastY = y;
        }
    }
}

export function handleCanvasMouseUp(e, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setIdOrder, setNeedsRedraw) {
    if (!isMouseDown) { return; } // Ignore reentering
    isMouseDown = false;
    lastX = -1;
    lastY = -1;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rect = canvas.getBoundingClientRect();
    if (e.type !== "touchend" && e.type !== "touchcancel") {
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        stroke.push(x, y);
    }
    stroke = draw.getCurvePoints(stroke, 0.5);
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

    if (!isEraser) {
        // Delete livestroke lines and restroke interpolated and potentially buffered strokes
        ctx.putImageData(imageData, 0, 0);
        draw.drawCurve(ctx, stroke);
        updateStrokeCollection(setStrokeCollection, strokeObject, wsRef);
        hbx.addHitbox(setHitboxCollection, strokeObject);

        // add to actions stack
        setIdOrder((prev) => {
            let _prev = [...prev];
            _prev.push([strokeObject.id, strokeObject.type]);
            return _prev;
        });
    } else {
        eraser(setHitboxCollection, setStrokeCollection, setIdOrder, strokeObject, setNeedsRedraw, wsRef);
    }
}

export function handleCanvasMouseLeave(e, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setIdOrder, setNeedsRedraw) {
    handleCanvasMouseUp(e, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setIdOrder, setNeedsRedraw);
}

export function updateStrokeCollection(setStrokeCollection, strokeObject, wsRef) {
    // Add stroke to strokeCollection
    setStrokeCollection((prev) => {
        let res = { ...prev };
        res[strokeObject.id] = strokeObject;
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

export function eraser(setHitboxCollection, setStrokeCollection, setIdOrder, strokeObject, setNeedsRedraw, wsRef) {
    let positions = strokeObject.position.slice(0);
    let idsToDelete = {};

    setHitboxCollection((prev) => {
        let pointSkipFactor = 16; // only check every p-th (x,y) position to reduce computational load
        let quadMinPixDist = 25; // quadratic minimum distance between points to be valid for hitbox calculation
        let padding = 0;
        let hitbox = hbx.getHitbox(positions, pointSkipFactor, quadMinPixDist, padding);
        let _prev = { ...prev };
        for (let i = 0; i < hitbox.length; i++) {
            let xy = hitbox[i];
            if (_prev.hasOwnProperty(xy)) { // there are IDs in this hitbox position
                Object.keys(_prev[xy]).forEach((id) => {
                    idsToDelete[id] = true;
                })
            }
        }

        // remove deleted id hitboxes from collection
        Object.keys(_prev).forEach((posKey) => {
            Object.keys(idsToDelete).forEach((keyToDel) => {
                delete _prev[posKey][keyToDel];
            });
        });

        // Send ids to delete
        let deleteObjects = Object.keys(idsToDelete).map((id) => {
            return { id: id, type: "delete" };
        })

        if (deleteObjects.length > 0 && wsRef.current !== null) {
            wsRef.current.send(JSON.stringify(deleteObjects));
        }

        return _prev;
    });

    // erase id's strokes from collection
    setStrokeCollection((prev) => {
        let _prev = { ...prev }
        Object.keys(idsToDelete).forEach((keyToDel) => {
            // add to actions stack
            setIdOrder((prev) => {
                let _prev = [...prev];
                _prev.push([keyToDel, "delete"]);
                return _prev;
            });
            delete _prev[keyToDel];
        });

        return _prev;
    });

    setNeedsRedraw(x => x + 1); // trigger redraw
}