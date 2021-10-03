import { Point } from "drawing/stroke/types"
import { CANVAS_WIDTH, ZOOM_SCALE_MAX, ZOOM_SCALE_MIN } from "../../constants"
import { BoardView } from "./types"

export const centerView = (view: BoardView): void => {
    if (view.stageWidth >= CANVAS_WIDTH * view.stageScale.x) {
        view.stageX = view.stageWidth / 2
    } else {
        fitToPage(view)
    }
}

export const fitToPage = (view: BoardView): void => {
    const oldScale = view.stageScale.y
    const newScale = window.innerWidth / CANVAS_WIDTH
    view.stageScale = { x: newScale, y: newScale }
    view.stageX = view.stageWidth / 2
    view.stageY =
        view.stageHeight / 2 -
        ((view.stageHeight / 2 - view.stageY) / oldScale) * newScale
}

export const zoomToPointWithScale = (
    view: BoardView,
    zoomPoint: Point,
    zoomScale: number
): void => {
    const oldScale = view.stageScale.x
    const mousePointTo = {
        x: (zoomPoint.x - view.stageX) / oldScale,
        y: (zoomPoint.y - view.stageY) / oldScale,
    }
    let newScale = oldScale * zoomScale
    if (newScale > ZOOM_SCALE_MAX) {
        newScale = ZOOM_SCALE_MAX
    } else if (newScale < ZOOM_SCALE_MIN) {
        newScale = ZOOM_SCALE_MIN
    }

    view.stageScale = { x: newScale, y: newScale }

    if (view.keepCentered) {
        // if zoomed out then center, else zoom to mouse coords
        const x = (window.innerWidth - CANVAS_WIDTH * newScale) / 2
        if (x >= 0) {
            view.stageX = x
        } else {
            view.stageX = zoomPoint.x - mousePointTo.x * newScale
        }
    } else {
        view.stageX = zoomPoint.x - mousePointTo.x * newScale
    }

    view.stageY = zoomPoint.y - mousePointTo.y * newScale
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
