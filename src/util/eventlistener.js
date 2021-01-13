import * as draw from './drawingengine.js';
import * as proc from './processing.js';

let isMouseDown = false;
let sampleCount = 0;
let lastX = -1;
let lastY = -1;
let stroke = [];
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
    lastX = x;
    lastY = y;

    if (_activeTool === "pen") {
        stroke = [x, y];
        draw.drawFillCircle(ctxLive, x, y, _lineWidth/2);
    }
    else if (_activeTool === "line") {
        stroke = [x, y];
    }
    else if (_activeTool === "triangle") {
        if (trianglePoints === 0){
            stroke = [];
        }
        // DOSMTH
    }
    else if (_activeTool === "circle") {
        // DOSMTH
    }
    else { // eraser
        stroke = [x, y];
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
        let moveDist = Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2); // Quadratic distance moved from last registered point

        if (moveDist > 1000 || sampleCount > minSampleCount) {
            sampleCount = 1;
            const ctxLive = liveCanvas.getContext('2d');
            
            if (_activeTool === "pen") {
                draw.drawLine(lastX, lastY, x, y, ctxLive);
                stroke.push(x, y);
                lastX = x;
                lastY = y;
            }
            else if (_activeTool === "line") {
                ctxLive.clearRect(0, 0, 2480, 3508);
                draw.drawLine(lastX, lastY, x, y, ctxLive)
            }
            else if (_activeTool === "triangle") {
                ctxLive.clearRect(0, 0, 2480, 3508);
                if (trianglePoints === 0){
                    draw.drawFillCircle(ctxLive, x, y, _lineWidth/2);
                }
                else if (trianglePoints === 1){
                    draw.drawLine(stroke[0], stroke[1], x, y, ctxLive);
                }
                else if (trianglePoints === 2) {
                    let trianglepts = [...stroke];
                    trianglepts.push(x,y);
                    draw.drawFillTriangle(ctxLive, trianglepts);
                }
            }
            else if (_activeTool === "circle") {
                ctxLive.clearRect(0, 0, 2480, 3508);
                draw.drawLine(lastX, lastY, x, y, ctxLive)
            }
            else { // eraser
                stroke.push(x, y);
                lastX = x;
                lastY = y;
                // DO NOTHING?
            }
        }
    }
}

export function handleCanvasMouseUp(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef) {
    if (!isMouseDown) { return; } // Ignore reentering
    isMouseDown = false;
    lastX = -1;
    lastY = -1;
    const liveCanvas = liveCanvasRef.current;
    const ctxLive = liveCanvas.getContext('2d');

    if (e.type !== "touchend" && e.type !== "touchcancel") {
        let rect = liveCanvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / scaleRef.current * canvasResolutionFactor;;
        let y = (e.clientY - rect.top) / scaleRef.current * canvasResolutionFactor;;
        stroke.push(x, y);
    }
    
    if (_activeTool === "pen") {
        stroke = draw.getCurvePoints(stroke, 0.1);
    }
    stroke = stroke.map(x => Math.round(x * 1e3) / 1e3);

    // generate unique id
    let strokeid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4) + Date.now().toString(36).substr(4);
    let strokeObject = {
        page_id: pageId,
        id: strokeid,
        type: "stroke",
        tool: _activeTool,
        line_width: _lineWidth,
        color: _strokeStyle,
        position: stroke,
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
        ctxLive.clearRect(0, 0, 2480, 3508);
        trianglePoints += 1;
        if (trianglePoints === 1){
            draw.drawFillCircle(ctxLive, stroke[0], stroke[1], _lineWidth/2);
        }
        else if (trianglePoints === 2){
            draw.drawLine(stroke[0], stroke[1], stroke[2], stroke[3], ctxLive);
        }
        else if (trianglePoints === 3) {
            ctxLive.clearRect(0, 0, 2480, 3508);
            proc.processStrokes([strokeObject], "stroke", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
            trianglePoints = 0;
        }
    }
    else if (_activeTool === "circle") {
        proc.processStrokes([strokeObject], "stroke", setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef);
        ctxLive.clearRect(0, 0, 2480, 3508);
    }
    else { // eraser
        draw.eraser(setHitboxCollection, setStrokeCollection, setUndoStack, strokeObject, wsRef, canvasRef);
    }
}

export function handleCanvasMouseLeave(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef) {
    handleCanvasMouseUp(e, liveCanvasRef, pageId, canvasRef, wsRef, setStrokeCollection, setHitboxCollection, setUndoStack, scaleRef);
}