import * as draw from './drawingengine.js';
import * as proc from './processing.js';

let isMouseDown = false;
let sampleCount = 0;
let lastX = -1;
let lastY = -1;
let stroke = [];
const canvasResolutionFactor = 4;
let _activeTool = "pen";
let _lineWidth;
let _strokeStyle;

export function handleCanvasMouseDown(e, liveCanvasRef, scaleRef, setActiveTool, setLineWidth, setStrokeStyle) {
    setActiveTool((activeTool) => {
        _activeTool = activeTool;
        return activeTool;
    });
    setLineWidth((lineWidth) => {
        _lineWidth = lineWidth;
        return lineWidth;
    });
    setStrokeStyle((strokeStyle) => {
        _strokeStyle = strokeStyle;
        return strokeStyle;
    });

    const liveCanvas = liveCanvasRef.current;
    const ctxLive = liveCanvas.getContext('2d');
    ctxLive.lineWidth = _lineWidth;
    ctxLive.strokeStyle = _strokeStyle;

    if (e.type === "touchstart") {
        e = e.changedTouches[0];
    }
    else {
        if (e.button === 0) { // left-click
            // console.log("Hi");
        } else if (e.button === 2) { // right-click
            _activeTool = "eraser";
        }
    }

    isMouseDown = true;
    sampleCount = 1;
    let rect = liveCanvas.getBoundingClientRect();
    let x = (e.clientX - rect.left) / scaleRef.current * canvasResolutionFactor;
    let y = (e.clientY - rect.top) / scaleRef.current * canvasResolutionFactor;
    stroke = [x, y];
    lastX = x;
    lastY = y;
}

export function handleCanvasMouseMove(e, liveCanvasRef, scaleRef) {
    if (isMouseDown) {
        let minSampleCount = 10;
        if (e.type === "touchmove") {
            e = e.touches[0];
            minSampleCount = 3; // more precision for stylus
        }
        sampleCount += 1;
        const liveCanvas = liveCanvasRef.current;
        let rect = liveCanvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / scaleRef.current * canvasResolutionFactor;;
        let y = (e.clientY - rect.top) / scaleRef.current * canvasResolutionFactor;;
        let moveDist = Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2); // Quadratic distance moved from last registered point

        if (moveDist > 1000 || sampleCount > minSampleCount) {
            sampleCount = 1;
            stroke.push(x, y);
            const ctxLive = liveCanvas.getContext('2d');
            
            if (_activeTool !== "eraser") {
                draw.drawLine(lastX, lastY, x, y, ctxLive);
            }
            lastX = x;
            lastY = y;
        }
    }
}

export function handleCanvasMouseUp(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef) {
    if (!isMouseDown) { return; } // Ignore reentering
    isMouseDown = false;
    lastX = -1;
    lastY = -1;
    const liveCanvas = liveCanvasRef.current;
    let rect = liveCanvas.getBoundingClientRect();
    if (e.type !== "touchend" && e.type !== "touchcancel") {
        let x = (e.clientX - rect.left) / scaleRef.current * canvasResolutionFactor;;
        let y = (e.clientY - rect.top) / scaleRef.current * canvasResolutionFactor;;
        stroke.push(x, y);
    }
    stroke = draw.getCurvePoints(stroke, 0.5);
    stroke = stroke.map(x => Math.round(x * 1e3) / 1e3);
    // generate unique id
    let strokeid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4) + Date.now().toString(36).substr(4);
    let strokeObject = {
        page_id: pageId,
        id: strokeid,
        type: "stroke",
        line_width: _lineWidth,
        color: _strokeStyle,
        position: stroke,
    };

    if (_activeTool !== "eraser") {
        proc.processStrokes([strokeObject], "stroke", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
        const ctxLive = liveCanvas.getContext('2d');
        ctxLive.clearRect(0, 0, 2480, 3508);
    } else {
        draw.eraser(setHitboxCollection, setStrokeCollection, setUndoStack, strokeObject, wsRef, canvasRef);
    }
}

export function handleCanvasMouseLeave(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef) {
    handleCanvasMouseUp(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef);
}