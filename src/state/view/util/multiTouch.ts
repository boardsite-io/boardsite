import { TransformState } from "state/view/ViewState/index.types"
import { zoomTo } from "./zoomTo"

type Point = { x: number; y: number }

let lastZoomPoint: Point | null = null
let lastDistance = 0

interface MultiTouchMove {
    viewTransform: TransformState
    p1: Point
    p2: Point
}

export const multiTouchMove = ({
    viewTransform,
    p1,
    p2,
}: MultiTouchMove): TransformState => {
    if (!lastZoomPoint) {
        lastZoomPoint = getCenter(p1, p2)
        return viewTransform
    }

    const distance = getDistance(p1, p2)

    if (!lastDistance) {
        lastDistance = distance
    }

    const zoomPoint = getCenter(p1, p2)
    const zoomScale = distance / lastDistance
    const newViewTransform = zoomTo({
        viewTransform,
        zoomPoint,
        zoomScale,
    })

    newViewTransform.xOffset +=
        (zoomPoint.x - lastZoomPoint.x) / viewTransform.scale
    newViewTransform.yOffset +=
        (zoomPoint.y - lastZoomPoint.y) / viewTransform.scale

    lastDistance = distance
    lastZoomPoint = zoomPoint

    return newViewTransform
}

export const multiTouchEnd = (): void => {
    lastDistance = 0
    lastZoomPoint = null
}

/**
 * Helper export const  for calculating the distance between 2 touch points
 * @param {*} p1
 * @param {*} p2
 */
export const getDistance = (p1: Point, p2: Point): number =>
    Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)

/**
 * Helper export const  for calculating the center between 2 touch points
 * @param {*} p1
 * @param {*} p2
 */
export const getCenter = (p1: Point, p2: Point): Point => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
})
