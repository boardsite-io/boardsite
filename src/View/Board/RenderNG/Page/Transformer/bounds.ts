import { Point } from "drawing/stroke/index.types"
import { Page } from "state/board/state/index.types"

export const applyBounds = (point: Point, page: Page) => {
    let newX = point.x
    let newY = point.y

    if (newX > page.meta.size.width) newX = page.meta.size.width
    if (newX < 0) newX = 0
    if (newY > page.meta.size.height) newY = page.meta.size.height
    if (newY < 0) newY = 0

    return {
        x: newX,
        y: newY,
    }
}

const SNAP_DISTANCE = 10

export const applyLeaveBounds = (point: Point, page: Page) => {
    let newX = point.x
    let newY = point.y

    if (newX > page.meta.size.width - SNAP_DISTANCE) newX = page.meta.size.width
    if (newX < SNAP_DISTANCE) newX = 0
    if (newY > page.meta.size.height - SNAP_DISTANCE)
        newY = page.meta.size.height
    if (newY < SNAP_DISTANCE) newY = 0

    return {
        x: newX,
        y: newY,
    }
}
