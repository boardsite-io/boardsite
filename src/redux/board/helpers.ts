import { Point } from "drawing/stroke/types"
import {
    CANVAS_WIDTH,
    DEFAULT_PAGE_GAP,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
} from "consts"
import { BoardState, BoardView } from "./types"

export const getViewCenterY = ({ view }: BoardState): number =>
    (view.stageHeight / 2 - view.stageY) / view.stageScale.y

export const detectPageChange = (state: BoardState): void => {
    const centerY = getViewCenterY(state)
    const currPageId = state.pageRank[state.currentPageIndex]
    if (!currPageId) {
        return
    }
    const currPageHeight = state.pageCollection[currPageId].meta.height
    const scale = state.view.stageScale.x

    // Go to next page
    if (centerY > currPageHeight + DEFAULT_PAGE_GAP / 2) {
        // Check if last page
        if (state.currentPageIndex < state.pageRank.length - 1) {
            state.view.stageY += (currPageHeight + DEFAULT_PAGE_GAP) * scale
            state.currentPageIndex += 1
        }
    }
    // Go to previous page
    else if (centerY < -DEFAULT_PAGE_GAP / 2) {
        // Check if first page
        if (state.currentPageIndex > 0) {
            const targetPageId = state.pageRank[state.currentPageIndex - 1]
            const targetPageHeight =
                state.pageCollection[targetPageId].meta.height
            state.view.stageY -= (targetPageHeight + DEFAULT_PAGE_GAP) * scale
            state.currentPageIndex -= 1
        }
    }
}

export const centerView = (state: BoardState): void => {
    if (state.view.stageWidth >= CANVAS_WIDTH * state.view.stageScale.x) {
        state.view.stageX = state.view.stageWidth / 2
    } else {
        fitToPage(state)
    }
}

export const fitToPage = (state: BoardState): void => {
    const oldScale = state.view.stageScale.y
    const newScale = window.innerWidth / CANVAS_WIDTH
    state.view.stageScale = { x: newScale, y: newScale }
    state.view.stageX = state.view.stageWidth / 2
    state.view.stageY =
        state.view.stageHeight / 2 -
        ((state.view.stageHeight / 2 - state.view.stageY) / oldScale) * newScale
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

// variables for multitouch zoom
let lastCenter: Point | null = null
let lastDist = 0

export const multiTouchMove = (view: BoardView, p1: Point, p2: Point): void => {
    if (!lastCenter) {
        lastCenter = getCenter(p1, p2)
        return
    }
    const newCenter = getCenter(p1, p2)
    const dist = getDistance(p1, p2)

    if (!lastDist) {
        lastDist = dist
    }

    // local coordinates of center point
    const pointTo = {
        x: (newCenter.x - view.stageX) / view.stageScale.x,
        y: (newCenter.y - view.stageY) / view.stageScale.x,
    }

    // OPTION 1:
    const scale = view.stageScale.x * (dist / lastDist)
    view.stageScale = { x: scale, y: scale }

    // calculate new position of the stage
    const dx = newCenter.x - lastCenter.x
    const dy = newCenter.y - lastCenter.y

    view.stageX = newCenter.x - pointTo.x * scale + dx
    view.stageY = newCenter.y - pointTo.y * scale + dy

    // OPTION 2
    // zoomToPointWithScale(state, pointTo, dist / lastDist)

    // update info
    lastDist = dist
    lastCenter = newCenter
}

export const multiTouchEnd = (): void => {
    lastDist = 0
    lastCenter = null
}
