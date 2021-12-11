import { Point } from "drawing/stroke/index.types"
import { StageAttrs } from "redux/board/board.types"

// variables for multitouch zoom
let lastCenter: Point | null = null
let lastDist = 0

interface MultiTouchMove {
    attrs: StageAttrs
    p1: Point
    p2: Point
}

export const multiTouchMove = ({
    attrs,
    p1,
    p2,
}: MultiTouchMove): StageAttrs => {
    if (!lastCenter) {
        lastCenter = getCenter(p1, p2)
        return attrs
    }
    const newCenter = getCenter(p1, p2)
    const dist = getDistance(p1, p2)

    if (!lastDist) {
        lastDist = dist
    }

    // local coordinates of center point
    const pointTo = {
        x: (newCenter.x - attrs.x) / attrs.scaleX,
        y: (newCenter.y - attrs.y) / attrs.scaleY,
    }

    // OPTION 1:
    const scale = attrs.scaleX * (dist / lastDist)

    // calculate new position of the stage
    const dx = newCenter.x - lastCenter.x
    const dy = newCenter.y - lastCenter.y

    // OPTION 2
    // zoomToPointWithScale(state, pointTo, dist / lastDist)

    // update info
    lastDist = dist
    lastCenter = newCenter

    return {
        ...attrs,
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
        scaleX: scale,
        scaleY: scale,
    }
}

export const multiTouchEnd = (): void => {
    lastDist = 0
    lastCenter = null
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
