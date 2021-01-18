// ----------------------------------------------
// TYPES OF DATA / TOOLS
// pen : [x1, y1, x2, y2, ...]
// eraser : [x1, y1, x2, y2, ...]
// line : [x1, y1, x2, y2]
// triangle : [x1, y1, x2, y2, x3, y3]
// circle : [x, y, radius]
// ----------------------------------------------
import { startStroke, moveStroke, registerStroke } from './stroke.js';
import * as draw from './draw.js';
import * as constant from '../constants.js';
import store from '../redux/store.js';

let isMouseDown = false;
let sampleCount = 0;
let strokePoints = [];
//let shapeInProgress = false;
let activeTool;
let scaleFactor;

export function handleCanvasMouseDown(e, scaleRef) {
    activeTool = store.getState().drawControl.tool;
    scaleFactor = constant.CANVAS_PIXEL_RATIO / scaleRef.current;

    isMouseDown = true;
    sampleCount = 1;

    let rect = e.target.getBoundingClientRect();
    const curPos = {
        x: (e.clientX - rect.left) * scaleFactor,
        y: (e.clientY - rect.top) * scaleFactor,
    };

    if (e.type === "touchstart") {
        e = e.changedTouches[0];
    } else if (e.button === 2) {
        activeTool = "eraser";
    }

    strokePoints = [curPos];

    startStroke(e.target, activeTool, curPos);
}

export function handleCanvasMouseMove(e) {
    if (isMouseDown) {
        const liveCanvas = e.target;
        const rect = liveCanvas.getBoundingClientRect();

        const curPos = {
            x: (e.clientX - rect.left) * scaleFactor,
            y: (e.clientY - rect.top) * scaleFactor,
        };

        sampleCount += 1;
        if (sampleCount > constant.MIN_SAMPLE_COUNT) {
            moveStroke(liveCanvas, strokePoints, curPos, sampleCount);
            sampleCount = 0;
        }
    }
}

export function handleCanvasMouseUp(e, pageId, mainCanvasRef) {
    if (!isMouseDown) { return; } // Ignore reentering
    isMouseDown = false;
    const style = store.getState().drawControl.style;
    const liveCanvas = e.target;

    if (e.type !== "touchend" && e.type !== "touchcancel") {
        const rect = liveCanvas.getBoundingClientRect();
        strokePoints.push({
            x: (e.clientX - rect.left) * scaleFactor,
            y: (e.clientY - rect.top) * scaleFactor,
        });
    }

    registerStroke(mainCanvasRef.current, { pageId: pageId, style: style, type: "stroke", points: strokePoints, activeTool: activeTool });

    (async () => draw.clearCanvas(liveCanvas))()
}

export function handleCanvasMouseLeave(e, pageId, mainCanvasRef, liveCanvasRef) {
    handleCanvasMouseUp(e, pageId, mainCanvasRef, liveCanvasRef);
}
