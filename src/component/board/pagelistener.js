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
    const isActive = useSelector((state) => state.drawControl.isActive)
    let sampleCount = 0

    function getScaledPointerPosition(e) {
        const stage = e.target.getStage()
        const position = stage.getPointerPosition()
        const transform = stage.getAbsoluteTransform().copy().invert()
        return transform.point(position)
    }

    function onMouseDown(e) {
        if (
            e.evt.buttons === 2 || // ignore right click eraser, i.e. dont start stroke
            !isActive ||
            tool === toolType.DRAG
        ) {
            return
        }

        if (tool === toolType.ERASER) {
            store.dispatch(SET_ISMOUSEDOWN(true))
            return
        }

        store.dispatch(SET_ISMOUSEDOWN(true))
        sampleCount = 1

        const pos = getScaledPointerPosition(e)
        startLiveStroke(pos)
    }

    function onMouseMove(e) {
        if (
            !isMouseDown ||
            !isActive ||
            e.evt.buttons === 2 || // right mouse
            e.evt.buttons === 3 || // left+right mouse
            tool === toolType.DRAG
        ) {
            // cancel stroke when right / left+right mouse is clicked
            // store.dispatch(SET_ISMOUSEDOWN(false))
            return
        }
        if (tool === toolType.ERASER) {
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
        if (!isMouseDown || !isActive || toolType === toolType.DRAG) {
            return
        } // Ignore reentering
        if (tool === toolType.ERASER) {
            store.dispatch(SET_ISMOUSEDOWN(false))
            return
        }
        store.dispatch(SET_ISMOUSEDOWN(false))

        // update last position
        const pos = getScaledPointerPosition(e)
        moveLiveStroke(pos)

        // register finished stroke
        registerLiveStroke(pageId)
    }

    return (
        <Rect
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
            x={0}
            y={
                (CANVAS_HEIGHT + 20) *
                store.getState().boardControl.present.pageRank.indexOf(pageId)
            }
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
