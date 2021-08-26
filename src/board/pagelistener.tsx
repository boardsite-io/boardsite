import React, { useEffect, useRef } from "react"
import { Rect } from "react-konva"
import * as types from "konva/types/shapes/Rect"
import { KonvaEventObject } from "konva/types/Node"
import { Stage } from "konva/types/Stage"
import { Vector2d } from "konva/types/types"
import store from "../redux/store"
import {
    startLiveStroke,
    moveLiveStroke,
    registerLiveStroke,
    getPageIndex,
    abortLiveStroke,
} from "../drawing/strokeactions"
import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_FULL_HEIGHT } from "../constants"
import { SET_ISMOUSEDOWN } from "../redux/slice/drawcontrol"
import { useCustomSelector } from "../redux/hooks"

interface PageListenerProps {
    pageId: string
}

const PageListener: React.FC<PageListenerProps> = ({ pageId }) => {
    const isMouseDown = useCustomSelector(
        (state) => state.drawControl.isMouseDown
    )

    function getScaledPointerPosition(e: KonvaEventObject<MouseEvent>) {
        const stage = e.target.getStage() as Stage
        const position = stage.getPointerPosition()
        const transform = stage.getAbsoluteTransform().copy().invert()
        return transform.point(position as Vector2d)
    }

    function onMouseDown(e: KonvaEventObject<MouseEvent>) {
        if (e.evt.buttons === 2) {
            return
        }
        store.dispatch(SET_ISMOUSEDOWN(true))
        const pos = getScaledPointerPosition(e)
        startLiveStroke(pos)
    }

    function onMouseMove(e: KonvaEventObject<MouseEvent>) {
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

    function onMouseUp(e: KonvaEventObject<MouseEvent>) {
        if (!isMouseDown) {
            return
        } // Ignore reentering

        store.dispatch(SET_ISMOUSEDOWN(false))

        // update last position
        const pos = getScaledPointerPosition(e)
        moveLiveStroke(pos)

        // register finished stroke
        registerLiveStroke(pageId, e)
    }

    const onTouchStart = (e: KonvaEventObject<TouchEvent>) => {
        if (isValidTouch(e)) {
            onMouseDown(e as unknown as KonvaEventObject<MouseEvent>)
        }
    }

    const onTouchMove = (e: KonvaEventObject<TouchEvent>) => {
        if (isValidTouch(e)) {
            onMouseMove(e as unknown as KonvaEventObject<MouseEvent>)
        } else {
            abortLiveStroke()
        }
    }

    const onTouchEnd = (e: KonvaEventObject<TouchEvent>) => {
        onMouseUp(e as unknown as KonvaEventObject<MouseEvent>)
    }

    const isValidTouch = (e: KonvaEventObject<TouchEvent>) => {
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

    // cache the rect for performance
    const ref = useRef<types.Rect>(null)
    useEffect(() => {
        ref.current?.cache()
    }, [])
    const isListening = useCustomSelector(
        (state) => state.drawControl.isListening
    )
    const isPanMode = useCustomSelector((state) => state.drawControl.isPanMode)

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

export default PageListener
