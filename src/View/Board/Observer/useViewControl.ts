import { useCallback, useEffect, useRef } from "react"
import { ZOOM_IN_WHEEL_SCALE, ZOOM_OUT_WHEEL_SCALE } from "consts"
import { ToolType } from "drawing/stroke/index.types"
import { TransformState } from "state/view/ViewState/index.types"
import { viewState } from "state/view"
import {
    isMenuOpen,
    multiTouchEnd,
    multiTouchMove,
    zoomTo,
} from "state/view/util"
import { updateViewTransform } from "state/view/interface"
import { useCustomSelector } from "hooks"

export const useViewControl = () => {
    const isPanMode = useCustomSelector(
        (state) => state.drawing.tool.type === ToolType.Pan
    )

    const lastX = useRef<number>(0)
    const lastY = useRef<number>(0)
    const isMouseDown = useRef<boolean>(false)

    const preventDefaultWheel = useCallback((e) => {
        e.preventDefault()
    }, [])

    useEffect(() => {
        document.addEventListener("mousewheel", preventDefaultWheel, {
            passive: false,
        })

        return () =>
            document.removeEventListener("mousewheel", preventDefaultWheel)
    }, [])

    const panningUpdate = useCallback((e: React.MouseEvent) => {
        if (!isMouseDown.current) return

        const { xOffset, yOffset, scale } = viewState.getTransformState()

        const newTransform = {
            scale,
            xOffset: xOffset + (e.clientX - lastX.current) / scale,
            yOffset: yOffset + (e.clientY - lastY.current) / scale,
        }

        updateViewTransform(newTransform)

        lastX.current = e.clientX
        lastY.current = e.clientY
    }, [])

    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.preventDefault()
            lastX.current = e.clientX
            lastY.current = e.clientY
            isMouseDown.current = true
        },
        []
    )

    const onMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.preventDefault()
            panningUpdate(e)
        },
        []
    )

    const onMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.preventDefault()
            panningUpdate(e)
            isMouseDown.current = false
        },
        []
    )

    const onTouchStart: React.TouchEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            if (isMenuOpen()) return
            e.preventDefault()
            onTouchMove(e)
        },
        []
    )

    const onTouchMove: React.TouchEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            if (isMenuOpen()) return
            e.preventDefault()
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
                    viewTransform: viewState.getTransformState(),
                    p1,
                    p2,
                })

                updateViewTransform(newTransform)
            }
        },
        []
    )

    const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            if (isMenuOpen()) return
            e.preventDefault()
            onTouchMove(e)
            multiTouchEnd()
        },
        []
    )

    const onTouchCancel: React.TouchEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.preventDefault()
        },
        []
    )

    const onWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            const { clientX, clientY, deltaX, deltaY, ctrlKey } = e
            const transform = viewState.getTransformState()

            if (isPanMode || ctrlKey) {
                const newTransform = zoomTo({
                    viewTransform: transform,
                    zoomPoint: { x: clientX, y: clientY },
                    zoomScale:
                        deltaY < 0 ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
                })

                updateViewTransform(newTransform)
            } else {
                const newTransform: TransformState = {
                    ...transform,
                    xOffset: transform.xOffset - deltaX / transform.scale,
                    yOffset: transform.yOffset - deltaY / transform.scale,
                }

                updateViewTransform(newTransform)
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
