import { handleAddStrokes, handleDeleteStrokes } from "drawing/handlers"
import { Point } from "drawing/stroke/index.types"
import { useCustomSelector } from "hooks"
import { MouseEvent, TouchEvent, useCallback, useEffect } from "react"
import { CLEAR_TRANSFORM, SET_TRANSFORM_STROKES } from "redux/board"
import store from "redux/store"
import { draw } from "../../shapes"
import { PageOffset } from "../index.types"
import {
    getMousePosition,
    getTouchPosition,
    isValidClick,
    isValidTouch,
} from "../Live/helpers"
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

let lastPoint: Point
let handleType: TrHandle | "clear" | "pan"
let isMouseOrTouchDown = false

export const useTransformer = (
    trRef: React.RefObject<HTMLDivElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    pageOffset: PageOffset
) => {
    const transformStrokes = useCustomSelector(
        (state) => state.board.transformStrokes
    )

    const bounds = getOuterBounds(transformStrokes)

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
                store.dispatch(CLEAR_TRANSFORM())
                return
            }

            isMouseOrTouchDown = true
            lastPoint = point
            shapeTr.startTr()

            if (transformStrokes) {
                handleDeleteStrokes(transformStrokes)
            }
        },
        [transformStrokes]
    )

    const onMove = useCallback(
        (point: Point) => {
            const delta = {
                x: point.x - lastPoint.x,
                y: point.y - lastPoint.y,
            }

            if (handleType !== "clear" && handleType !== "pan") {
                shapeTr.updateTrScale(trRef.current, delta, bounds, handleType)
            } else {
                shapeTr.updateTrPosition(trRef.current, delta)
            }

            lastPoint = point
        },
        [bounds]
    )

    const onEnd = useCallback(
        (point: Point) => {
            onMove(point)
            if (transformStrokes) {
                const newStrokes = shapeTr.endTr(
                    trRef.current,
                    transformStrokes,
                    bounds
                )

                handleAddStrokes(newStrokes, true)
                store.dispatch(SET_TRANSFORM_STROKES(newStrokes))
            }
            isMouseOrTouchDown = false
        },
        [bounds, onMove, transformStrokes]
    )

    const onMouseDown = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isValidClick(e)) {
                const point = getMousePosition(e, pageOffset)
                onStart(point, e)
            }
        },
        [pageOffset, onStart, transformStrokes]
    )

    const onMouseMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isMouseOrTouchDown && isValidClick(e)) {
                const point = getMousePosition(e, pageOffset)
                onMove(point)
            }
        },
        [pageOffset, onMove, bounds]
    )

    const onMouseUp = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isMouseOrTouchDown && isValidClick(e)) {
                const point = getMousePosition(e, pageOffset)
                onEnd(point)
            }
        },
        [pageOffset, onEnd]
    )

    const onMouseLeave = useCallback((e: MouseEvent<HTMLDivElement>) => {
        onMouseUp(e)
    }, [])

    const onTouchStart = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isValidTouch(e)) {
                const point = getTouchPosition(e, pageOffset)
                onStart(point, e)
            }
        },
        [onStart]
    )

    const onTouchMove = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isMouseOrTouchDown && isValidTouch(e)) {
                const point = getTouchPosition(e, pageOffset)
                onMove(point)
            }
        },
        [onMove]
    )

    const onTouchEnd = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            if (isMouseOrTouchDown) {
                const point = getTouchPosition(e, pageOffset)
                onEnd(point)
            }
        },
        [onEnd]
    )

    const onTouchCancel = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            onTouchEnd(e)
        },
        [onTouchEnd]
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
