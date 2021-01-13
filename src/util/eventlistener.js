import * as draw from './drawingengine.js';
import * as proc from './processing.js';

let isMouseDown = false;
let sampleCount = 0;
let strokePoints = [];
let trianglePoints = 0;

const canvasResolutionFactor = 4;
let _activeTool;
let _lineWidth;
let _strokeStyle;

export function handleCanvasMouseDown(e, liveCanvasRef, scaleRef, setActiveTool, setLineWidth, setStrokeStyle) {
    setActiveTool((activeTool) => {
        _activeTool = activeTool;
        return activeTool;
    });
    setLineWidth((lineWidth) => {
        _lineWidth = lineWidth * canvasResolutionFactor;
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
    ctxLive.fillStyle = _strokeStyle;

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

    if (_activeTool === "pen") {
        strokePoints = [x, y];
        draw.drawFillCircle(ctxLive, x, y, _lineWidth/2);
    }
    else if (_activeTool === "line") {
        strokePoints = [x, y];
    }
    else if (_activeTool === "triangle") {
        if (trianglePoints === 0){
            strokePoints = [];
        }
    }
    else if (_activeTool === "circle") {
        // DOSMTH
    }
    else { // eraser
        strokePoints = [x, y];
    }
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
        let x = (e.clientX - rect.left) / scaleRef.current * canvasResolutionFactor;
        let y = (e.clientY - rect.top) / scaleRef.current * canvasResolutionFactor;
        let moveDist = Math.pow(x - strokePoints[strokePoints.length-2], 2) + Math.pow(y - strokePoints[strokePoints.length-1], 2); // Quadratic distance moved from last registered point
        const ctxLive = liveCanvas.getContext('2d');

        if (_activeTool === "line") {
            ctxLive.clearRect(0, 0, 2480, 3508);
            draw.drawLine(strokePoints[0], strokePoints[1], x, y, ctxLive)
        }
        else if (_activeTool === "triangle") {
            ctxLive.clearRect(0, 0, 2480, 3508);
            if (trianglePoints === 0){
                draw.drawFillCircle(ctxLive, x, y, _lineWidth/2);
            }
            else if (trianglePoints === 1){
                draw.drawLine(strokePoints[0], strokePoints[1], x, y, ctxLive);
            }
            else if (trianglePoints === 2) {
                let trianglepts = [...strokePoints];
                trianglepts.push(x,y);
                draw.drawFillTriangle(ctxLive, trianglepts);
            }
        }
        else if (_activeTool === "circle") {
            // TODO
        }
        else if (moveDist > 1000 || sampleCount > minSampleCount) {
            sampleCount = 1;
            if (_activeTool === "pen") {
                // draw.drawLine(strokePoints[strokePoints.length-2], strokePoints[strokePoints.length-1], x, y, ctxLive);
                strokePoints.push(x, y);
                let strokeLen = strokePoints.length;
                if (strokeLen >= 6) {
                    draw.drawLines(ctxLive, strokePoints.slice(strokeLen - 6));
                }
            }
            else { // eraser
                strokePoints.push(x, y);
            }
        }
    }
}

export function handleCanvasMouseUp(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef) {
    if (!isMouseDown) { return; } // Ignore reentering
    isMouseDown = false;
    const liveCanvas = liveCanvasRef.current;
    const ctxLive = liveCanvas.getContext('2d');

    if (e.type !== "touchend" && e.type !== "touchcancel") {
        let rect = liveCanvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / scaleRef.current * canvasResolutionFactor;;
        let y = (e.clientY - rect.top) / scaleRef.current * canvasResolutionFactor;;
        strokePoints.push(x, y);
    }
    
    if (_activeTool === "pen" && strokePoints.length > 4) {
        strokePoints = draw.getCurvePoints(strokePoints, 0.1);
    }
    strokePoints = strokePoints.map(x => Math.round(x * 1e3) / 1e3);

    // generate unique id
    let strokeid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4) + Date.now().toString(36).substr(4);
    let strokeObject = {
        page_id: pageId,
        id: strokeid,
        type: "stroke",
        tool: _activeTool,
        line_width: _lineWidth,
        color: _strokeStyle,
        position: strokePoints,
    };

    if (_activeTool === "pen") {
        proc.processStrokes([strokeObject], "stroke", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
        ctxLive.clearRect(0, 0, 2480, 3508);
    }
    else if (_activeTool === "line") {
        proc.processStrokes([strokeObject], "stroke", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
        ctxLive.clearRect(0, 0, 2480, 3508);
    }
    else if (_activeTool === "triangle") {
        trianglePoints += 1;
        if (trianglePoints === 1){
            draw.drawFillCircle(ctxLive, strokePoints[0], strokePoints[1], _lineWidth/2);
        }
        else if (trianglePoints === 2){
            draw.drawLine(strokePoints[0], strokePoints[1], strokePoints[2], strokePoints[3], ctxLive);
        }
        else if (trianglePoints === 3) {
            proc.processStrokes([strokeObject], "stroke", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
            ctxLive.clearRect(0, 0, 2480, 3508);
            trianglePoints = 0;
        }
    }
    else if (_activeTool === "circle") {
        // proc.processStrokes([strokeObject], "stroke", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
        // ctxLive.clearRect(0, 0, 2480, 3508);
    }
    else { // eraser
        draw.eraser(setHitboxCollection, setStrokeCollection, setUndoStack, strokeObject, wsRef, canvasRef);
        ctxLive.clearRect(0, 0, 2480, 3508);
    }
}

export function handleCanvasMouseLeave(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef) {
    handleCanvasMouseUp(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef);
}