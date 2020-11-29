import * as draw from './drawingengine.js';
import * as hd from './handledata.js';

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

export function handleCanvasMouseUp(e, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack) {
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
        pageId: pageId,
        id: strokeid,
        type: "stroke",
        line_width: ctx.lineWidth,
        color: ctx.strokeStyle,
        position: stroke,
    };

    if (!isEraser) {
        ctx.putImageData(imageData, 0, 0);
        hd.processStrokes([strokeObject], "stroke", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
    } else {
        draw.eraser(setHitboxCollection, setStrokeCollection, setUndoStack, strokeObject, wsRef, canvasRef);
    }
}

export function handleCanvasMouseLeave(e, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack) {
    handleCanvasMouseUp(e, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack);
}