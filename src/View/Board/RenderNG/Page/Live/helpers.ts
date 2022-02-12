import { LIVESTROKE_SEGMENT_SIZE } from "consts"
import { LiveStroke } from "drawing/livestroke/index.types"
import { Point } from "drawing/stroke/index.types"
import React, { MouseEvent, TouchEvent } from "react"
import store from "redux/store"
import { viewState } from "state/view"
import { draw } from "../../draw"

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

export const isValidClick = (e: MouseEvent<HTMLCanvasElement>): boolean => {
    const isValid =
        e.buttons !== 2 && // right mouse
        e.buttons !== 3 // left+right mouse

    return isValid
}

export const getTouchPosition = (e: TouchEvent<HTMLCanvasElement>): Point => {
    const touch = e.touches[0] || e.changedTouches[0]

    const point = {
        x: touch.pageX,
        y: touch.pageY,
    }
    return applyTransformTo(point, e)
}

export const getMousePosition = (e: MouseEvent<HTMLCanvasElement>): Point => {
    const point = {
        x: e.clientX,
        y: e.clientY,
    }
    return applyTransformTo(point, e)
}

const applyTransformTo = (
    point: Point,
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
): Point => {
    const canvas = e.target as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    const { scale } = viewState.getTransformState()

    return {
        x: point.x / scale - rect.left,
        y: point.y / scale - rect.top,
    }
}

export const isValidTouch = (e: TouchEvent<HTMLCanvasElement>): boolean => {
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

export const getSegments = (liveStroke: LiveStroke): number[][] =>
    new Array<number[]>(
        Math.ceil(liveStroke.points.length / LIVESTROKE_SEGMENT_SIZE)
    )
        .fill([])
        .map((_, i) =>
            liveStroke.points.slice(
                LIVESTROKE_SEGMENT_SIZE * i,
                LIVESTROKE_SEGMENT_SIZE * (i + 1) + 2
            )
        )
