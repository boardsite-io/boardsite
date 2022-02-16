import { LiveStroke } from "drawing/livestroke/index.types"
import { Point } from "drawing/stroke/index.types"
import React, { MouseEvent, TouchEvent } from "react"
import store from "redux/store"
import { view } from "state/view"
import { draw } from "View/Board/RenderNG/shapes"
import { PageOffset } from "../index.types"

export const drawLiveStroke = (
    liveStroke: LiveStroke,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    draw(ctx, liveStroke)
}

export const isValidClick = (e: MouseEvent<HTMLElement>): boolean => {
    const isValid =
        e.buttons !== 2 && // right mouse
        e.buttons !== 3 // left+right mouse

    return isValid
}

export const getTouchPosition = (
    e: TouchEvent<HTMLElement>,
    pageOffset: PageOffset
): Point => {
    const touch = e.touches[0] || e.changedTouches[0]

    const point = {
        x: touch.pageX,
        y: touch.pageY,
    }
    return applyTransformTo(point, pageOffset)
}

export const getMousePosition = (
    e: MouseEvent<HTMLElement>,
    pageOffset: PageOffset
): Point => {
    const point = {
        x: e.pageX,
        y: e.pageY,
    }
    return applyTransformTo(point, pageOffset)
}

const applyTransformTo = (point: Point, pageOffset: PageOffset): Point => {
    const { scale, xOffset, yOffset } = view.getViewTransform()

    return {
        x: point.x / scale - xOffset - pageOffset.left,
        y: point.y / scale - yOffset - pageOffset.top,
    }
}

export const isValidTouch = (e: TouchEvent<HTMLElement>): boolean => {
    const touch1 = e.touches[0] as Touch & { touchType?: string }
    const touch2 = e.touches[1] as Touch & { touchType?: string }
    const { directDraw } = store.getState().drawing

    if (touch1.touchType === undefined) {
        return false
    }

    // exit if draw with finger is not set
    if (!directDraw && touch1.touchType === "direct") {
        return false
    }

    // double finger => invalid
    return !(touch1 && touch2)
}
