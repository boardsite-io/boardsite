import { MouseEvent, TouchEvent, useCallback } from "react"
import { Point, ToolType } from "drawing/stroke/index.types"
import { BoardLiveStroke } from "drawing/livestroke"
import { drawing, useDrawing } from "state/drawing"
import { PageId } from "state/board/state/index.types"
import {
    drawLiveStroke,
    getMousePosition,
    getTouchPosition,
    isValidClick,
    isValidTouch,
} from "./helpers"
import { PageOffset } from "../index.types"

let isMouseOrTouchDown = false
const liveStroke = new BoardLiveStroke()

export const useLiveStroke = (
    pageId: PageId,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    pageOffset: PageOffset
) => {
    const isPanMode = useDrawing("useLiveStroke").tool.type === ToolType.Pan

    const startLiveStroke = useCallback(
        (point: Point) => {
            isMouseOrTouchDown = true

            liveStroke.setTool(drawing.getState().tool).start(point, pageId)

            drawLiveStroke(liveStroke, canvasRef)
        },
        [canvasRef, pageId]
    )

    const moveLiveStroke = useCallback(
        (point: Point) => {
            liveStroke.move(point)
            drawLiveStroke(liveStroke, canvasRef)
        },
        [canvasRef]
    )

    const endLiveStroke = useCallback(
        (point: Point) => {
            liveStroke.move(point)

            // register finished stroke
            const stroke = liveStroke.finalize()
            BoardLiveStroke.register(stroke)
            drawLiveStroke(liveStroke, canvasRef)

            isMouseOrTouchDown = false
        },
        [canvasRef]
    )

    // cancel stroke when right / left+right mouse
    // is clicked or when touch is invalid
    const resetLiveStroke = useCallback(() => {
        if (!liveStroke.isReset()) {
            liveStroke.reset()
            drawLiveStroke(liveStroke, canvasRef)
        }

        isMouseOrTouchDown = false
    }, [canvasRef])

    const onMouseDown = useCallback(
        (e: MouseEvent<HTMLCanvasElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isValidClick(e)) {
                const point = getMousePosition(e, pageOffset)
                startLiveStroke(point)
            }
        },
        [startLiveStroke, pageOffset]
    )

    const onMouseMove = useCallback(
        (e: MouseEvent<HTMLCanvasElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isMouseOrTouchDown && isValidClick(e)) {
                const point = getMousePosition(e, pageOffset)
                moveLiveStroke(point)
            } else {
                resetLiveStroke()
            }
        },
        [pageOffset, resetLiveStroke, moveLiveStroke]
    )

    const onMouseUp = useCallback(
        (e: MouseEvent<HTMLCanvasElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isMouseOrTouchDown) {
                const point = getMousePosition(e, pageOffset)
                endLiveStroke(point)
            }
        },
        [pageOffset, endLiveStroke]
    )

    const onMouseLeave = useCallback(
        (e: MouseEvent<HTMLCanvasElement>) => {
            onMouseUp(e)
        },
        [onMouseUp]
    )

    const onTouchStart = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            e.preventDefault()

            const point = getTouchPosition(e, pageOffset)
            if (isValidTouch(e)) {
                startLiveStroke(point)
            }
        },
        [pageOffset, startLiveStroke]
    )

    const onTouchMove = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            e.preventDefault()

            if (isMouseOrTouchDown && isValidTouch(e)) {
                const point = getTouchPosition(e, pageOffset)
                moveLiveStroke(point)
            } else {
                resetLiveStroke()
            }
        },
        [pageOffset, resetLiveStroke, moveLiveStroke]
    )

    const onTouchEnd = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            e.preventDefault()

            if (isMouseOrTouchDown) {
                const point = getTouchPosition(e, pageOffset)
                endLiveStroke(point)
            }
        },
        [pageOffset, endLiveStroke]
    )

    const onTouchCancel = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            onTouchEnd(e)
        },
        [onTouchEnd]
    )

    if (isPanMode) {
        return {}
    }

    return {
        isPanMode,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel,
    }
}
