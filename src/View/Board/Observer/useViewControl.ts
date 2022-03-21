import { useCallback, useEffect } from "react"
import { ZOOM_IN_WHEEL_SCALE, ZOOM_OUT_WHEEL_SCALE } from "consts"
import { Point, ToolType } from "drawing/stroke/index.types"
import { view } from "state/view"
import {
    isMenuOpen,
    multiTouchEnd,
    multiTouchMove,
    zoomTo,
} from "state/view/util"
import { ViewTransform } from "state/view/state/index.types"
import { useGState } from "state"

let previousPoint = { x: 0, y: 0 }
let isMouseDown = false
let multiTouchActive = false

export const useViewControl = () => {
    const isPanMode =
        useGState("UseViewControl").drawing.tool.type === ToolType.Pan

    const preventDefaultWheel = useCallback((e) => {
        e.preventDefault()
    }, [])

    useEffect(() => {
        document.addEventListener("mousewheel", preventDefaultWheel, {
            passive: false,
        })

        return () =>
            document.removeEventListener("mousewheel", preventDefaultWheel)
    }, [preventDefaultWheel])

    const panningUpdate = useCallback((point: Point, isTouch = false) => {
        if (!isMouseDown && !isTouch) return

        const { xOffset, yOffset, scale } = view.getState().viewTransform

        const newTransform = {
            scale,
            xOffset: xOffset + (point.x - previousPoint.x) / scale,
            yOffset: yOffset + (point.y - previousPoint.y) / scale,
        }

        view.updateViewTransform(newTransform)

        previousPoint.x = point.x
        previousPoint.y = point.y
    }, [])

    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.preventDefault()
            previousPoint.x = e.clientX
            previousPoint.y = e.clientY
            isMouseDown = true
        },
        []
    )

    const onMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.preventDefault()
            const point: Point = {
                x: e.clientX,
                y: e.clientY,
            }
            panningUpdate(point)
        },
        [panningUpdate]
    )

    const onMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.preventDefault()
            const point: Point = {
                x: e.clientX,
                y: e.clientY,
            }
            panningUpdate(point)
            isMouseDown = false
        },
        [panningUpdate]
    )

    const onTouchMove: React.TouchEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            if (isMenuOpen()) return

            const touch1 = e.touches[0]
            const touch2 = e.touches[1]

            if (touch1 && touch2) {
                const p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                }
                const p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                }

                const newTransform = multiTouchMove({
                    viewTransform: view.getState().viewTransform,
                    p1,
                    p2,
                })

                view.updateViewTransform(newTransform)

                multiTouchActive = true
            } else if (touch1 && !touch2 && isPanMode && !multiTouchActive) {
                const point: Point = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                }
                panningUpdate(point, true)
            }
        },
        [isPanMode, panningUpdate]
    )

    const onTouchStart: React.TouchEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            const touch1 = e.touches[0]
            if (!touch1 || isMenuOpen()) return

            previousPoint = {
                x: touch1.clientX,
                y: touch1.clientY,
            }
        },
        []
    )

    const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            if (isMenuOpen()) return
            onTouchMove(e)
            multiTouchEnd()

            // Both fingers are off the screen
            if (e.touches[0] === undefined) {
                multiTouchActive = false
            }
        },
        [onTouchMove]
    )

    const onTouchCancel: React.TouchEventHandler<HTMLDivElement> =
        useCallback(() => {
            multiTouchEnd()
            multiTouchActive = false
        }, [])

    const onWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            const { clientX, clientY, deltaX, deltaY, ctrlKey } = e
            const { viewTransform } = view.getState()

            if (isPanMode || ctrlKey) {
                const newTransform = zoomTo({
                    viewTransform,
                    zoomPoint: { x: clientX, y: clientY },
                    zoomScale:
                        deltaY < 0 ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
                })

                view.updateViewTransform(newTransform)
            } else {
                const newTransform: ViewTransform = {
                    ...viewTransform,
                    xOffset:
                        viewTransform.xOffset - deltaX / viewTransform.scale,
                    yOffset:
                        viewTransform.yOffset - deltaY / viewTransform.scale,
                }

                view.updateViewTransform(newTransform)
            }
        },
        [isPanMode]
    )

    const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback((e) => {
        e.preventDefault()
    }, [])

    return {
        isPanMode,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel,
        onWheel,
        onScroll,
    }
}
