// ----------------------------------------------
// TYPES OF DATA / TOOLS
// pen : [x1, y1, x2, y2, ...]
// eraser : [x1, y1, x2, y2, ...]
// line : [x1, y1, x2, y2]
// triangle : [x1, y1, x2, y2, x3, y3]
// circle : [x, y, radius]
// ----------------------------------------------

import * as draw from './drawingengine.js';
import * as proc from './processing.js';
import * as constant from '../constants.js';
import store from '../redux/store.js';

let isMouseDown = false;
let sampleCount = 0;
let strokePoints = [];
let shapeInProgress = false;
let style;
let activeTool;
let scaleFactor;

export function handleCanvasMouseDown(e, liveCanvasRef, scaleRef) {
    let storeX = store.getState(); // {boardControl: {pageRank, pageCollection}, drawControl: {}}
    

    const liveCanvas = liveCanvasRef.current;
    const ctxLive = liveCanvas.getContext('2d');
    style = storeX.drawControl.style;
    activeTool = storeX.drawControl.tool;
    scaleFactor = constant.CANVAS_PIXEL_RATIO / scaleRef.current;
    ctxLive.lineWidth = style.width;
    ctxLive.strokeStyle = style.color;
    ctxLive.fillStyle = style.color;

    isMouseDown = true;
    sampleCount = 1;

    let rect = liveCanvas.getBoundingClientRect();
    let x = (e.clientX - rect.left) * scaleFactor;
    let y = (e.clientY - rect.top) * scaleFactor;

    if (e.type === "touchstart") {
        e = e.changedTouches[0];
    }
    else {
        if (e.button === 0) { // left-click
            // console.log("Hi");
        } else if (e.button === 2) { // right-click
            activeTool = "eraser";
        }
    }

    if (activeTool === "pen") {
        strokePoints = [x, y];
        draw.drawFillCircle(ctxLive, x, y, style.width/2);
        shapeInProgress = false;
    }
    else if (activeTool === "triangle") {
        if (shapeInProgress){
            draw.drawTriangle(ctxLive, [...strokePoints, x, y]);
        } else {
            strokePoints = [x, y];
        }
    }
    else {
        strokePoints = [x, y];
        shapeInProgress = false;
    }
}

export function handleCanvasMouseMove(e, liveCanvasRef) {
    if (isMouseDown) {
        let minSampleCount = 10;
        if (e.type === "touchmove") {
            e = e.touches[0];
            minSampleCount = 3; // more precision for stylus
        }
        sampleCount += 1;
        const liveCanvas = liveCanvasRef.current;
        let rect = liveCanvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) * scaleFactor;
        let y = (e.clientY - rect.top) * scaleFactor;
        let moveDist = Math.pow(x - strokePoints[strokePoints.length-2], 2) + Math.pow(y - strokePoints[strokePoints.length-1], 2); // Quadratic distance moved from last registered point
        const ctxLive = liveCanvas.getContext('2d');

        if (activeTool === "line") {
            ctxLive.clearRect(0, 0, 2480, 3508);
            draw.drawLines(ctxLive, [strokePoints[0], strokePoints[1], x, y]);
        }
        else if (activeTool === "triangle") {
            ctxLive.clearRect(0, 0, 2480, 3508);
            if (shapeInProgress){
                draw.drawTriangle(ctxLive, [...strokePoints, x, y]);
            }
            else {
                draw.drawLines(ctxLive, [strokePoints[0], strokePoints[1], x, y]);
            }
        }
        else if (activeTool === "circle") {
            ctxLive.clearRect(0, 0, 2480, 3508);
            let radius = Math.sqrt(Math.pow(x - strokePoints[0], 2) + Math.pow(y - strokePoints[1], 2));
            draw.drawCircle(ctxLive, strokePoints[0], strokePoints[1], radius);
        }
        else if (moveDist > 1000 || sampleCount > minSampleCount) {
            sampleCount = 1;
            if (activeTool === "pen") {
                strokePoints.push(x, y);
                draw.drawLines(ctxLive, strokePoints.slice(strokePoints.length - 4));
            }
            else { // eraser
                strokePoints.push(x, y);
            }
        }
    }
}

export function handleCanvasMouseUp(e, pageId, mainCanvasRef, liveCanvasRef) {
    if (!isMouseDown) { return; } // Ignore reentering
    isMouseDown = false;
    const liveCanvas = liveCanvasRef.current;
    const ctxLive = liveCanvas.getContext('2d');
    const mainCanvas = mainCanvasRef.current;
    const ctxMain = mainCanvas.getContext('2d');

    if (e.type !== "touchend" && e.type !== "touchcancel") {
        let rect = liveCanvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) * scaleFactor;
        let y = (e.clientY - rect.top) * scaleFactor;
        strokePoints.push(x, y);
        strokePoints = strokePoints.map(x => Math.round(x * 1e3) / 1e3);
    }

    let strokeid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4) + Date.now().toString(36).substr(4); // generate unique id
    let strokeObject = { page_id: pageId, id: strokeid, type: "stroke", tool: activeTool, line_width: style.width, color: style.color, position: strokePoints};

    if (activeTool === "eraser") {
        // draw.eraser(setBoardInfo, strokeObject, wsRef, canvasRef);
        // ctxLive.clearRect(0, 0, 2480, 3508);
    }
    else if (activeTool === "triangle") {
        if (shapeInProgress){
            proc.processStrokes([strokeObject], "stroke", ctxMain);
            ctxLive.clearRect(0, 0, 2480, 3508);
        }
        else {
            draw.drawLines(ctxLive, strokePoints);
        }
        shapeInProgress = !shapeInProgress;
    }
    else {
        if (activeTool === "pen") {
            draw.drawLines(ctxLive, strokePoints.slice(strokePoints.length - 4));
            strokeObject.position = draw.getCurvePoints(strokePoints, 0.5);
        }
        else if (activeTool === "line") {
            draw.drawLines(ctxLive, strokePoints);
        }
        else if (activeTool === "circle") {
            let radius = Math.sqrt(Math.pow(strokePoints[2] - strokePoints[0], 2) + Math.pow(strokePoints[3] - strokePoints[1], 2));
            strokeObject.position[2] = radius;
            draw.drawCircle(ctxLive, strokePoints[0], strokePoints[1], radius);
        }

        setTimeout(() => { // Put into timeout function without delay to prevent halting the other functions in this function
            proc.processStrokes([strokeObject], "stroke", ctxMain);
            ctxLive.clearRect(0, 0, 2480, 3508);
        }, 0);
    }
}

export function handleCanvasMouseLeave(e, pageId, mainCanvasRef, liveCanvasRef) {
    handleCanvasMouseUp(e, pageId, mainCanvasRef, liveCanvasRef);
}
