import { Point } from "drawing/stroke/index.types"
import { StageAttrs } from "redux/board/index.types"
import { zoomTo } from "./adjustView"

let lastZoomPoint: Point | null = null
let lastDistance = 0

interface MultiTouchMove {
    stageAttrs: StageAttrs
    p1: Point
    p2: Point
}

export const multiTouchMove = ({
    stageAttrs,
    p1,
    p2,
}: MultiTouchMove): StageAttrs => {
    if (!lastZoomPoint) {
        lastZoomPoint = getCenter(p1, p2)
        return stageAttrs
    }

    const distance = getDistance(p1, p2)

    if (!lastDistance) {
        lastDistance = distance
    }

    const zoomPoint = getCenter(p1, p2)
    const zoomScale = distance / lastDistance
    const newStageAttrs = zoomTo({
        stageAttrs,
        zoomPoint,
        zoomScale,
    })

    newStageAttrs.x += zoomPoint.x - lastZoomPoint.x
    newStageAttrs.y += zoomPoint.y - lastZoomPoint.y

    lastDistance = distance
    lastZoomPoint = zoomPoint

    return newStageAttrs
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
