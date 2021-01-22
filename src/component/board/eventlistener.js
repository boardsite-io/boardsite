import {
    startLiveStroke,
    moveLiveStroke,
    registerLiveStroke,
} from "./stroke.js"
import { MIN_SAMPLE_COUNT, tool } from "../../constants.js"
import store from "../../redux/store.js"
import { actEraseStroke } from "../../redux/slice/boardcontrol.js"

let isMouseDown = false,
    sampleCount = 0

export function handleCanvasMouseDown(e, scaleRef, pageId) {
    isMouseDown = true
    if (e.evt.buttons === 2) {
        return
    }
    //scaleFactor = 1 //CANVAS_PIXEL_RATIO / scaleRef.current
    sampleCount = 1

    const pos = e.target.getStage().getPointerPosition()
    // const relPos = {
    //     x: (e.evt.clientX - pos.x) * scaleFactor,
    //     y: (e.evt.clientY - pos.y) * scaleFactor,
    // }

    startLiveStroke(pos, pageId)
}

export function handleCanvasMouseMove(e) {
    if (!isMouseDown || e.evt.buttons === 2) {
        return
    }

    sampleCount += 1
    if (sampleCount > MIN_SAMPLE_COUNT) {
        const pos = e.target.getStage().getPointerPosition()
        // const relPos = {
        //     x: (e.evt.clientX - pos.x) * scaleFactor,
        //     y: (e.evt.clientY - pos.y) * scaleFactor,
        // }
        moveLiveStroke(pos)
        sampleCount = 0
    }
}

export function handleCanvasMouseUp(e) {
    if (!isMouseDown) {
        return
    } // Ignore reentering
    isMouseDown = false

    // update latest position
    const pos = e.target.getStage().getPointerPosition()

    registerLiveStroke(pos)
}

export function handleStrokeMouseEnter(e, stroke) {
    if (stroke.id === undefined || !isMouseDown) {
        return
    }

    if (
        store.getState().drawControl.tool === tool.ERASER ||
        e.evt.buttons === 2
    ) {
        store.dispatch(actEraseStroke(stroke))
    }
}
