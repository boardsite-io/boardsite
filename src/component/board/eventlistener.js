import { startStroke, moveStroke, registerStroke } from "./stroke.js"
import { CANVAS_PIXEL_RATIO, MIN_SAMPLE_COUNT, tool } from "../../constants.js"
import * as draw from "./draw.js"
import store from "../../redux/store.js"
import { CollectionsBookmarkOutlined } from "@material-ui/icons"
import { actEraseStroke } from "../../redux/slice/boardcontrol.js"

let isMouseDown = false,
    sampleCount = 0,
    strokePoints = [],
    activeTool,
    scaleFactor

export function handleCanvasMouseDown(e, setLiveStroke, scaleRef) {
    const style = store.getState().drawControl.style
    activeTool = store.getState().drawControl.tool
    scaleFactor = 1 //CANVAS_PIXEL_RATIO / scaleRef.current
    isMouseDown = true
    sampleCount = 1

    const pos = e.target.getStage().getPointerPosition()
    // const relPos = {
    //     x: (e.evt.clientX - pos.x) * scaleFactor,
    //     y: (e.evt.clientY - pos.y) * scaleFactor,
    // }

    // if (e.type === "touchstart") {
    //     e = e.changedTouches[0]
    // } else if (e.button === 2) {
    //     activeTool = tool.ERASER
    // }

    // strokePoints = [curPos]

    setLiveStroke(startStroke(pos, style, activeTool))
}

export function handleCanvasMouseMove(e, setLiveStroke) {
    if (isMouseDown) {
        sampleCount += 1
        if (sampleCount > MIN_SAMPLE_COUNT) {
            const pos = e.target.getStage().getPointerPosition()
            // const relPos = {
            //     x: (e.evt.clientX - pos.x) * scaleFactor,
            //     y: (e.evt.clientY - pos.y) * scaleFactor,
            // }
            moveStroke(pos, setLiveStroke)
            sampleCount = 0
        }
    }
}

export function handleCanvasMouseUp(e, setLiveStroke, pageId) {
    if (!isMouseDown) {
        return
    } // Ignore reentering
    isMouseDown = false

    // ;(async () => draw.clearCanvas(liveCanvas))()
    
    // ugly fix for setState during render warning => dont call action in setState!?
    let _liveStroke;
    setLiveStroke((liveStroke) => {
        _liveStroke = liveStroke
        return liveStroke
    })
    registerStroke(_liveStroke, pageId)
    setLiveStroke({});
}

export function handleCanvasMouseLeave(
    e,
    pageId,
    mainCanvasRef,
    liveCanvasRef
) {
    handleCanvasMouseUp(e, pageId, mainCanvasRef, liveCanvasRef)
}

export function handleStrokeMouseEnter(e, stroke) {
    if (stroke.id === undefined || !isMouseDown) {
        return
    }
    if (activeTool === tool.ERASER) {
        store.dispatch(actEraseStroke(stroke))
    }
}
