import { startStroke, moveStroke, registerStroke } from "./stroke.js"
import { CANVAS_PIXEL_RATIO, MIN_SAMPLE_COUNT, tool } from "../constants.js"
import * as draw from "./draw.js"
import store from "../redux/store.js"

let isMouseDown = false,
    sampleCount = 0,
    strokePoints = [],
    activeTool,
    scaleFactor

export function handleCanvasMouseDown(e, scaleRef) {
    activeTool = store.getState().drawControl.tool
    scaleFactor = CANVAS_PIXEL_RATIO / scaleRef.current
    isMouseDown = true
    sampleCount = 1

    const liveCanvas = e.target
    const rect = liveCanvas.getBoundingClientRect()
    const curPos = {
        x: (e.clientX - rect.left) * scaleFactor,
        y: (e.clientY - rect.top) * scaleFactor,
    }

    if (e.type === "touchstart") {
        e = e.changedTouches[0]
    } else if (e.button === 2) {
        activeTool = tool.ERASER
    }

    strokePoints = [curPos]
    startStroke(e.target, activeTool, curPos)
}

export function handleCanvasMouseMove(e) {
    if (isMouseDown) {
        sampleCount += 1
        if (sampleCount > MIN_SAMPLE_COUNT) {
            const liveCanvas = e.target
            const rect = liveCanvas.getBoundingClientRect()
            const curPos = {
                x: (e.clientX - rect.left) * scaleFactor,
                y: (e.clientY - rect.top) * scaleFactor,
            }
            strokePoints.push(curPos)
            moveStroke(liveCanvas, strokePoints)
            sampleCount = 0
        }
    }
}

export function handleCanvasMouseUp(e, pageId, mainCanvasRef) {
    if (!isMouseDown) {
        return
    } // Ignore reentering
    isMouseDown = false
    const style = store.getState().drawControl.style
    const liveCanvas = e.target

    if (e.type !== "touchend" && e.type !== "touchcancel") {
        const rect = liveCanvas.getBoundingClientRect()
        strokePoints.push({
            x: (e.clientX - rect.left) * scaleFactor,
            y: (e.clientY - rect.top) * scaleFactor,
        })
    }

    registerStroke(mainCanvasRef.current, {
        pageId: pageId,
        style: style,
        type: "stroke",
        points: strokePoints,
        activeTool: activeTool,
    })

    ;(async () => draw.clearCanvas(liveCanvas))()
}

export function handleCanvasMouseLeave(
    e,
    pageId,
    mainCanvasRef,
    liveCanvasRef
) {
    handleCanvasMouseUp(e, pageId, mainCanvasRef, liveCanvasRef)
}
