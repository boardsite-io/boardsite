import React from "react"
import { useSelector } from "react-redux"
import { Rect } from "react-konva"
import store from "../../redux/store"
import {
    startLiveStroke,
    moveLiveStroke,
    registerLiveStroke,
    getPageIndex,
} from "./stroke_actions"
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    CANVAS_FULL_HEIGHT,
} from "../../constants"
import { END_LIVESTROKE, SET_ISMOUSEDOWN } from "../../redux/slice/drawcontrol"
import pageBackground from "./page_backgrounds"

export default function PageListener({ pageId, trRef, layerRef }) {
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)

    function getScaledPointerPosition(e) {
        const stage = e.target.getStage()
        const position = stage.getPointerPosition()
        const transform = stage.getAbsoluteTransform().copy().invert()
        return transform.point(position)
    }

    function onMouseDown(e) {
        console.log(trRef.current)
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
        registerLiveStroke(pageId, trRef, layerRef)
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

    const abortLiveStroke = () => {
        store.dispatch(SET_ISMOUSEDOWN(false))
        store.dispatch(END_LIVESTROKE())
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
    const pageBg = useSelector(
        (state) => state.boardControl.pageCollection[pageId]?.meta?.background
    )

    return (
        <Rect
            draggable={false}
            listening={!isPanMode && !isListening}
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
            x={0}
            y={CANVAS_FULL_HEIGHT * getPageIndex(pageId)}
            stroke="#000"
            strokeWidth={0.2}
            fill="#ffffff"
            shadowColor="#000000"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={0.5}
            onMouseDown={onMouseDown}
            onMousemove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            sceneFunc={pageBackground[pageBg]}
        />
    )
}
