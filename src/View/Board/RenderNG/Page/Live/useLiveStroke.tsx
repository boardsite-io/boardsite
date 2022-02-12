import { MouseEvent, TouchEvent, useCallback } from "react"
import store from "redux/store"
import { Point, ToolType } from "drawing/stroke/index.types"
import { useCustomSelector } from "hooks"
import { PageId } from "redux/board/index.types"
import { BoardLiveStroke } from "drawing/livestroke"
import {
    drawLiveStroke,
    getMousePosition,
    getTouchPosition,
    isValidClick,
    isValidTouch,
} from "./helpers"

let isMouseOrTouchDown = false
const liveStroke = new BoardLiveStroke()

export const useLiveStroke = (
    pageId: PageId,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    const isPanMode = useCustomSelector(
        (state) => state.drawing.tool.type === ToolType.Pan
    )

    const startLiveStroke = useCallback(
        (point: Point) => {
            isMouseOrTouchDown = true

            liveStroke
                .setTool(store.getState().drawing.tool)
                .start(point, pageId)

            drawLiveStroke(liveStroke, canvasRef)
        },
        [isMouseOrTouchDown]
    )

    const moveLiveStroke = useCallback(
        (point: Point) => {
            liveStroke.move(point)
            drawLiveStroke(liveStroke, canvasRef)
        },
        [isMouseOrTouchDown]
    )

    const endLiveStroke = useCallback(
        (point: Point) => {
            liveStroke.move(point)

            // register finished stroke
            const stroke = liveStroke.finalize()
            BoardLiveStroke.register(stroke, {
                x: 0,
                y: 0,
            })
            drawLiveStroke(liveStroke, canvasRef)

            isMouseOrTouchDown = false
        },
        [isMouseOrTouchDown]
    )

    // cancel stroke when right / left+right mouse
    // is clicked or when touch is invalid
    const resetLiveStroke = useCallback(() => {
        if (!liveStroke.isReset()) {
            liveStroke.reset()
            drawLiveStroke(liveStroke, canvasRef)
        }

        isMouseOrTouchDown = false
    }, [])

    const onMouseDown = useCallback(
        (e: MouseEvent<HTMLCanvasElement>) => {
            if (isValidClick(e)) {
                const point = getMousePosition(e)
                startLiveStroke(point)
            }
        },
        [isMouseOrTouchDown]
    )

    const onMouseMove = useCallback(
        (e: MouseEvent<HTMLCanvasElement>) => {
            if (isMouseOrTouchDown && isValidClick(e)) {
                const point = getMousePosition(e)
                moveLiveStroke(point)
            } else {
                resetLiveStroke()
            }
        },
        [moveLiveStroke]
    )

    const onMouseUp = useCallback(
        (e: MouseEvent<HTMLCanvasElement>) => {
            if (isMouseOrTouchDown) {
                const point = getMousePosition(e)
                endLiveStroke(point)
            }
        },
        [endLiveStroke]
    )

    const onMouseLeave = useCallback(
        (e: MouseEvent<HTMLCanvasElement>) => {
            if (isMouseOrTouchDown) {
                const point = getMousePosition(e)
                endLiveStroke(point) // TODO: improve border behaviour
            }
        },
        [onMouseUp]
    )

    const onTouchStart = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            e.preventDefault()
            const point = getTouchPosition(e)
            if (isValidTouch(e)) {
                startLiveStroke(point)
            }
        },
        [startLiveStroke]
    )

    const onTouchMove = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            e.preventDefault()

            if (isMouseOrTouchDown && isValidTouch(e)) {
                const point = getTouchPosition(e)
                moveLiveStroke(point)
            } else {
                resetLiveStroke()
            }
        },
        [liveStroke, moveLiveStroke]
    )

    const onTouchEnd = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            e.preventDefault()

            if (isMouseOrTouchDown) {
                const point = getTouchPosition(e)
                endLiveStroke(point)
            }
        },
        [endLiveStroke]
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
    }
}
