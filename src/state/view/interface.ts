import {
    DEFAULT_VIEW_SCALE,
    DEFAULT_VIEW_OFFSET_Y,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
    MAX_PIXEL_SCALE,
    TRANSFORM_PIXEL_SCALE_DEBOUNCE,
    DEVICE_PIXEL_RATIO,
} from "consts"
import { debounce } from "lodash"
import { DECREMENT_PAGE_INDEX, INCREMENT_PAGE_INDEX } from "redux/board"
import store from "redux/store"
import { view } from "state/view"
import { ViewTransform } from "./state/index.types"
import {
    applyBounds,
    DetectionResult,
    detectPageChange,
    getCenterOfScreen,
    getCenterX,
    getCenterY,
    getPageSize,
    newOffsetY,
    toNextPage,
    toPreviousPage,
    zoomTo,
} from "./util"

export const updateViewTransform = (newTransform: ViewTransform) => {
    const detectionResult = detectPageChange(newTransform)

    if (detectionResult === DetectionResult.Next) {
        newTransform = toNextPage(newTransform)
        store.dispatch(INCREMENT_PAGE_INDEX())
    } else if (detectionResult === DetectionResult.Previous) {
        newTransform = toPreviousPage(newTransform)
        store.dispatch(DECREMENT_PAGE_INDEX())
    }
    newTransform = applyBounds(newTransform)

    view.setTransformState(newTransform)
    checkPixelScale(newTransform)
}

/**
 * Update pixelScale if needed
 */
const checkPixelScale = debounce((newTransform: ViewTransform) => {
    const pixelScale = Math.min(
        DEVICE_PIXEL_RATIO * Math.ceil(newTransform.scale),
        MAX_PIXEL_SCALE
    )

    if (pixelScale !== view.getLayerConfig().pixelScale) {
        view.setLayerConfig({
            pixelScale,
        })
    }
}, TRANSFORM_PIXEL_SCALE_DEBOUNCE)

export const handleZoomCenter = (isZoomingIn: boolean): void => {
    const newTransform = zoomTo({
        viewTransform: view.getViewTransform(),
        zoomPoint: getCenterOfScreen(),
        zoomScale: isZoomingIn ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
    })

    updateViewTransform(newTransform)
}

export const handleResetView = (): void => {
    updateViewTransform({
        scale: DEFAULT_VIEW_SCALE,
        xOffset: getCenterX(),
        yOffset: DEFAULT_VIEW_OFFSET_Y,
    })
}

export const handleResetViewScale = (): void => {
    const newScale = 1
    const newTransform = {
        scale: newScale,
        xOffset: getCenterX() / newScale,
        yOffset: newOffsetY(newScale, getCenterY()),
    }
    updateViewTransform(newTransform)
}

export const handleFitToPage = (): void => {
    const newScale = window.innerWidth / getPageSize().width
    const newTransform: ViewTransform = {
        scale: newScale,
        xOffset: getCenterX() / newScale,
        yOffset: newOffsetY(newScale, getCenterY()),
    }
    updateViewTransform(newTransform)
}
