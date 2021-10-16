import { Point } from "redux/drawing/drawing.types"
import {
    CANVAS_WIDTH,
    DEFAULT_PAGE_GAP,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
} from "consts"
import { BoardState, BoardView } from "../board.types"

export const insertPage = (
    pageRank: string[],
    index: number,
    newItem: string
): string[] =>
    index >= 0
        ? [...pageRank.slice(0, index), newItem, ...pageRank.slice(index)]
        : [...pageRank, newItem]

export const getViewCenterY = ({ view }: BoardState): number =>
    (view.stageHeight / 2 - view.stageY) / view.stageScale.y

export const detectPageChange = (state: BoardState): BoardState => {
    const centerY = getViewCenterY(state)
    const currPageId = state.pageRank[state.currentPageIndex]
    if (!currPageId) {
        return state
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
    return state
}

export const centerView = (view: BoardView): BoardView => {
    if (view.stageWidth >= CANVAS_WIDTH * view.stageScale.x) {
        view.stageX = view.stageWidth / 2
    } else {
        fitToPage(view)
    }
    return view
}

export const fitToPage = (viewCopy: BoardView): BoardView => {
    const oldScale = viewCopy.stageScale.y
    const newScale = window.innerWidth / CANVAS_WIDTH
    viewCopy.stageScale = { x: newScale, y: newScale }
    viewCopy.stageX = viewCopy.stageWidth / 2
    viewCopy.stageY =
        viewCopy.stageHeight / 2 -
        ((viewCopy.stageHeight / 2 - viewCopy.stageY) / oldScale) * newScale
    return viewCopy
}

export const zoomToPointWithScale = (
    viewCopy: BoardView,
    zoomPoint: Point,
    zoomScale: number
): BoardView => {
    const oldScale = viewCopy.stageScale.x
    const mousePointTo = {
        x: (zoomPoint.x - viewCopy.stageX) / oldScale,
        y: (zoomPoint.y - viewCopy.stageY) / oldScale,
    }
    let newScale = oldScale * zoomScale
    if (newScale > ZOOM_SCALE_MAX) {
        newScale = ZOOM_SCALE_MAX
    } else if (newScale < ZOOM_SCALE_MIN) {
        newScale = ZOOM_SCALE_MIN
    }

    viewCopy.stageScale = { x: newScale, y: newScale }

    if (viewCopy.keepCentered) {
        // if zoomed out then center, else zoom to mouse coords
        const x = (window.innerWidth - CANVAS_WIDTH * newScale) / 2
        if (x >= 0) {
            viewCopy.stageX = x
        } else {
            viewCopy.stageX = zoomPoint.x - mousePointTo.x * newScale
        }
    } else {
        viewCopy.stageX = zoomPoint.x - mousePointTo.x * newScale
    }

    viewCopy.stageY = zoomPoint.y - mousePointTo.y * newScale
    return viewCopy
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

export const multiTouchMove = (
    view: BoardView,
    p1: Point,
    p2: Point
): BoardView => {
    if (!lastCenter) {
        lastCenter = getCenter(p1, p2)
        return view
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
    return view
}

export const multiTouchEnd = (): void => {
    lastDist = 0
    lastCenter = null
}
