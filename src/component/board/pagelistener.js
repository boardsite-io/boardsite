import React, { memo } from "react"
import { useSelector } from "react-redux"
import { Rect } from "react-konva"
import store from "../../redux/store"
import { startLiveStroke, moveLiveStroke, registerLiveStroke } from "./stroke"
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    toolType,
    MIN_SAMPLE_COUNT,
} from "../../constants"
import { SET_ISMOUSEDOWN } from "../../redux/slice/drawcontrol"

export default memo(({ pageId }) => {
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)
    const tool = useSelector((state) => state.drawControl.liveStroke.type)
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)
    let sampleCount = 0

    function getScaledPointerPosition(e) {
        const stage = e.target.getStage()
        const position = stage.getPointerPosition()
        const transform = stage.getAbsoluteTransform().copy().invert()
        return transform.point(position)
    }

    function onMouseDown(e) {
        if (
            e.evt.buttons === 2 // ignore right click eraser, i.e. dont start stroke
        ) {
            return
        }

        store.dispatch(SET_ISMOUSEDOWN(true))

        // if (tool === toolType.ERASER) {
        //     return
        // }

        sampleCount = 1

        const pos = getScaledPointerPosition(e)
        startLiveStroke(pos)
    }

    function onMouseMove(e) {
        if (
            !isMouseDown ||
            e.evt.buttons === 2 || // right mouse
            e.evt.buttons === 3 // left+right mouse
        ) {
            // cancel stroke when right / left+right mouse is clicked
            // store.dispatch(SET_ISMOUSEDOWN(false))
            return
        }

        sampleCount += 1
        if (tool !== toolType.PEN) {
            // for all tools except pen we want to redraw on every update
            const pos = getScaledPointerPosition(e)
            moveLiveStroke(pos)
        } else if (sampleCount > MIN_SAMPLE_COUNT) {
            // for pen tool we skip some samples to improve performance
            const pos = getScaledPointerPosition(e)
            moveLiveStroke(pos)
            sampleCount = 0
        }
    }

    function onMouseUp(e) {
        if (!isMouseDown) {
            return
        } // Ignore reentering

        store.dispatch(SET_ISMOUSEDOWN(false))

        // update last position
        const pos = getScaledPointerPosition(e)
        moveLiveStroke(pos)

        // register finished stroke
        registerLiveStroke(pageId)
    }

    return (
        <Rect
            listening={
                !isPanMode && tool !== toolType.ERASER && tool !== toolType.DRAG
            }
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
            x={0}
            y={
                (CANVAS_HEIGHT + 20) *
                store.getState().boardControl.present.pageRank.indexOf(pageId)
            }
            stroke="#000"
            strokeWidth={0.2}
            fill="#eee"
            shadowColor="#000000"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={0.5}
            cornerRadius={4}
            onMouseDown={onMouseDown}
            onMousemove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUp}
        />
    )
})
