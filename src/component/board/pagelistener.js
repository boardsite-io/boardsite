import React, { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { Rect } from "react-konva"
import store from "../../redux/store"
import {
    startLiveStroke,
    moveLiveStroke,
    registerLiveStroke,
    getPageIndex,
    abortLiveStroke,
} from "../../drawing/strokeactions"
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    CANVAS_FULL_HEIGHT,
} from "../../constants"
import { SET_ISMOUSEDOWN } from "../../redux/slice/drawcontrol"

export default function PageListener({ pageId }) {
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)

    function getScaledPointerPosition(e) {
        const stage = e.target.getStage()
        const position = stage.getPointerPosition()
        const transform = stage.getAbsoluteTransform().copy().invert()
        return transform.point(position)
    }

    function onMouseDown(e) {
        if (e.evt.buttons === 2) {
            return
        }
        store.dispatch(SET_ISMOUSEDOWN(true))
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
            abortLiveStroke()
            return
        }

        const pos = getScaledPointerPosition(e)
        moveLiveStroke(pos)
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

    const onTouchStart = (e) => {
        if (isValidTouch(e)) {
            onMouseDown(e)
        }
    }

    const onTouchMove = (e) => {
        if (isValidTouch(e)) {
            onMouseMove(e)
        } else {
            abortLiveStroke()
        }
    }

    const onTouchEnd = (e) => {
        onMouseUp(e)
    }

    const isValidTouch = (e) => {
        e.evt.preventDefault()
        const touch1 = e.evt.touches[0]
        const touch2 = e.evt.touches[1]
        if (touch1.touchType === undefined) {
            return false
        }
        if (
            // exit if draw with finger is not set
            !store.getState().drawControl.directDraw &&
            touch1.touchType === "direct"
        ) {
            return false
        }
        return !(touch1 && touch2) // double finger
    }

    const isListening = useSelector((state) => state.drawControl.isListening)
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)

    // cache the rect for performance
    const ref = useRef()
    useEffect(() => ref.current.cache(), [])
    return (
        <Rect
            ref={ref}
            draggable={false}
            listening={!isPanMode && !isListening}
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
            x={0}
            y={CANVAS_FULL_HEIGHT * getPageIndex(pageId)}
            onMouseDown={onMouseDown}
            onMousemove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        />
    )
}
