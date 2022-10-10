import {
    ClipboardEventHandler,
    DragEventHandler,
    MouseEvent,
    TouchEvent,
    useCallback,
} from "react"
import { Point, ToolType } from "drawing/stroke/index.types"
import { BoardLiveStroke } from "drawing/livestroke"
import { view } from "state/view"
import { PageId } from "state/board/state/index.types"
import { useGState } from "state"
import {
    drawLiveStroke,
    getMousePosition,
    getTouchPosition,
    isValidClick,
    isValidTouch,
} from "util/drawing"
import { PageOffset } from "View/Board/RenderNG/Page/index.types"

let isMouseOrTouchDown = false
const liveStroke = new BoardLiveStroke()

export const useLiveStroke = (
    pageId: PageId,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    pageOffset: PageOffset
) => {
    const isPanMode =
        useGState("UseLiveStroke").drawing.tool.type === ToolType.Pan

    const startLiveStroke = useCallback(
        (point: Point) => {
            isMouseOrTouchDown = true
            liveStroke.start(point, pageId)
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
            liveStroke.end(point)
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
                const point = getMousePosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
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
                const point = getMousePosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
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
                const point = getMousePosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
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
            const point = getTouchPosition({
                event: e,
                pageOffset,
                transform: view.getState().viewTransform,
            })
            if (isValidTouch(e)) {
                startLiveStroke(point)
            }
        },
        [pageOffset, startLiveStroke]
    )

    const onTouchMove = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            if (isMouseOrTouchDown && isValidTouch(e)) {
                const point = getTouchPosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
                moveLiveStroke(point)
            } else {
                resetLiveStroke()
            }
        },
        [pageOffset, resetLiveStroke, moveLiveStroke]
    )

    const onTouchEnd = useCallback(
        (e: TouchEvent<HTMLCanvasElement>) => {
            if (isMouseOrTouchDown) {
                const point = getTouchPosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
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

    const onPaste: ClipboardEventHandler<HTMLCanvasElement> = useCallback(
        (e) => {
            // TODO
            e.preventDefault()
            console.log(e)
        },
        []
    )

    const onDrop: DragEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Do something with file here
            console.log(e.dataTransfer.files[0]) // <- file
        }
    }, [])

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
        onPaste,
        onDrop,
    }
}
