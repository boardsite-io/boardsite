import { handleUpdateStrokes } from "drawing/handlers"
import { Point } from "drawing/stroke/index.types"
import { MouseEvent, TouchEvent, useCallback, useEffect } from "react"
import { usePageLayer } from "state"
import { board } from "state/board"
import { Page } from "state/board/state/index.types"
import { view } from "state/view"
import {
    getMousePosition,
    getTouchPosition,
    isValidClick,
    isValidTouch,
} from "util/drawing"
import { draw } from "util/render/shapes"
import { PageOffset } from "../index.types"
import { applyBounds, applyLeaveBounds } from "./bounds"
import { extractHandle, getOuterBounds } from "./helpers"
import { TrHandle } from "./index.styled"
import { shapeTr } from "./shapeTransform"

export type TrCoords = {
    width: number
    height: number
    top: number
    left: number
    offsetX: number
    offsetY: number
}

let handleType: TrHandle | "clear" | "pan"
let isMouseOrTouchDown = false

export const useTransformer = (
    trRef: React.RefObject<HTMLDivElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    pageOffset: PageOffset,
    page: Page
) => {
    const { transformStrokes } = usePageLayer("transformer", page.pageId)
    const bounds = getOuterBounds(transformStrokes)
    shapeTr.setBounds(bounds)

    const trCoords: TrCoords = {
        width: bounds.xMax - bounds.xMin,
        height: bounds.yMax - bounds.yMin,
        top: bounds.yMin,
        left: bounds.xMin,
        offsetX: bounds.offsetX,
        offsetY: bounds.offsetY,
    }

    useEffect(() => {
        const trDiv = trRef.current
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")

        if (!ctx || !trDiv || !transformStrokes?.length) return
        shapeTr.resetTr(trDiv)

        // Reset is done by pixelScale hook so no need for additional reset
        ctx.translate(-bounds.xMin, -bounds.yMin)
        transformStrokes?.forEach((stroke) => {
            draw(ctx, stroke)
        })
    })

    const onStart = useCallback(
        (
            point: Point,
            e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
        ) => {
            handleType = extractHandle(e)
            if (handleType === "clear") {
                board.clearTransform()
                return
            }
            shapeTr.start(point, handleType)
            if (transformStrokes) {
                // non redoable delete
                board.handleSoftEraseStrokes({
                    data: transformStrokes,
                })
            }
            isMouseOrTouchDown = true
        },
        [transformStrokes]
    )

    const onMove = useCallback(
        (point: Point) => {
            if (handleType === "clear") return
            point = applyBounds(point, page)
            shapeTr.move(point, handleType, trRef.current)
        },
        [trRef, page]
    )

    const onEnd = useCallback(
        (point: Point) => {
            onMove(point)
            if (transformStrokes) {
                const newStrokes = shapeTr.end(trRef.current, transformStrokes)
                handleUpdateStrokes(newStrokes)
                board.setTransformStrokes(newStrokes, page.pageId)
            }
            isMouseOrTouchDown = false
        },
        [onMove, transformStrokes, page.pageId, trRef]
    )

    const onMouseDown = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isValidClick(e)) {
                const point = getMousePosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
                onStart(point, e)
            }
        },
        [pageOffset, onStart]
    )

    const onMouseMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isMouseOrTouchDown && isValidClick(e)) {
                const point = getMousePosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
                onMove(point)
            }
        },
        [pageOffset, onMove]
    )

    const onMouseUp = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isMouseOrTouchDown && isValidClick(e)) {
                const point = getMousePosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
                onEnd(point)
            }
        },
        [pageOffset, onEnd]
    )

    const onMouseLeave = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            onMouseUp(e)
        },
        [onMouseUp]
    )

    const onTouchStart = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            e.stopPropagation()

            if (isValidTouch(e)) {
                const point = getTouchPosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
                onStart(point, e)
            }
        },
        [onStart, pageOffset]
    )

    const onTouchMove = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            e.stopPropagation()

            if (isMouseOrTouchDown && isValidTouch(e)) {
                const point = getTouchPosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
                onMove(point)
            }
        },
        [onMove, pageOffset]
    )

    const onTouchEnd = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            e.stopPropagation()

            if (isMouseOrTouchDown) {
                const point = getTouchPosition({
                    event: e,
                    pageOffset,
                    transform: view.getState().viewTransform,
                })
                onEnd(point)
            }
        },
        [onEnd, pageOffset]
    )

    const onTouchCancel = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            e.stopPropagation()

            if (isMouseOrTouchDown) {
                const point = applyLeaveBounds(
                    getTouchPosition({
                        event: e,
                        pageOffset,
                        transform: view.getState().viewTransform,
                    }),
                    page
                )

                onEnd(point)
            }
        },
        [onEnd, pageOffset, page]
    )

    return {
        trCoords,
        transformStrokes,
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
