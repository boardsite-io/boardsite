import {
    SCROLL_LIMIT_FIRST_PAGE,
    SCROLL_LIMIT_HORIZONTAL,
    SCROLL_LIMIT_LAST_PAGE,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
} from "consts"
import { board } from "state/board"
import { ViewTransform } from "state/view/state/index.types"
import {
    getPageSize,
    isFullScreen,
    getCenterX,
    onFirstPage,
    onLastPage,
} from "./helpers"

export const applyBounds = (viewTransform: ViewTransform): ViewTransform => ({
    ...viewTransform,
    xOffset: applyBoundsX(viewTransform),
    yOffset: applyBoundsY(viewTransform),
})

export const applyBoundsX = (viewTransform: ViewTransform): number => {
    const { keepCentered } = board.getState().view

    // Zoomed out with keepCentered setting on sticks to center
    if (keepCentered && !isFullScreen()) {
        return getCenterX() / viewTransform.scale
    }

    const { leftBound, rightBound } = getLeftRightBounds(
        viewTransform,
        keepCentered
    )

    if (viewTransform.xOffset > rightBound) return rightBound
    if (viewTransform.xOffset < leftBound) return leftBound

    return viewTransform.xOffset
}

export const applyBoundsY = (viewTransform: ViewTransform): number => {
    if (onFirstPage()) {
        const upperBound = getUpperBound(viewTransform)

        if (viewTransform.yOffset > upperBound) {
            return upperBound
        }

        if (onLastPage()) {
            const lowerBound = getLowerBound(viewTransform)

            // If the upper and lower bounds cross
            // eachother then set y to upper bound
            if (upperBound < lowerBound) {
                return upperBound
            }

            if (viewTransform.yOffset < lowerBound) {
                return lowerBound
            }
        }
    }

    if (onLastPage()) {
        const lowerBound = getLowerBound(viewTransform)

        if (viewTransform.yOffset < lowerBound) {
            return lowerBound
        }
    }

    return viewTransform.yOffset
}

const getUpperBound = (viewTransform: ViewTransform): number =>
    (window.innerHeight * SCROLL_LIMIT_FIRST_PAGE) / viewTransform.scale

const getLowerBound = (viewTransform: ViewTransform): number =>
    (window.innerHeight * SCROLL_LIMIT_LAST_PAGE) / viewTransform.scale -
    getPageSize().height

const getLeftRightBounds = (
    viewTransform: ViewTransform,
    useStrictBounds: boolean
) => {
    const limit = useStrictBounds ? 1 : SCROLL_LIMIT_HORIZONTAL
    const offset =
        (window.innerWidth * limit) / viewTransform.scale -
        getPageSize().width / 2

    return {
        leftBound: offset,
        rightBound: window.innerWidth / viewTransform.scale - offset,
    }
}

export const boundScale = (scale: number) => {
    if (scale > ZOOM_SCALE_MAX) return ZOOM_SCALE_MAX
    if (scale < ZOOM_SCALE_MIN) return ZOOM_SCALE_MIN
    return scale
}