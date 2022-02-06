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
import { TransformState } from "state/view/ViewState/index.types"
import store from "redux/store"
import { viewState } from "state/view"
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

export const updateViewTransform = (newTransform: TransformState) => {
    const detectionResult = detectPageChange(newTransform)

    if (detectionResult === DetectionResult.Next) {
        newTransform = toNextPage(newTransform)
        store.dispatch(INCREMENT_PAGE_INDEX())
    } else if (detectionResult === DetectionResult.Previous) {
        newTransform = toPreviousPage(newTransform)
        store.dispatch(DECREMENT_PAGE_INDEX())
    }
    newTransform = applyBounds(newTransform)

    viewState.setViewState(newTransform)
    checkPixelScale(newTransform)
}

/**
 * Update pixelScale if needed
 */
const checkPixelScale = debounce((newTransform: TransformState) => {
    const pixelScale = Math.min(
        DEVICE_PIXEL_RATIO * Math.ceil(newTransform.scale),
        MAX_PIXEL_SCALE
    )

    if (pixelScale !== viewState.getLayerState().pixelScale) {
        viewState.setLayerState({
            pixelScale,
        })
    }
}, TRANSFORM_PIXEL_SCALE_DEBOUNCE)

export const handleZoomCenter = (isZoomingIn: boolean): void => {
    const newTransform = zoomTo({
        viewTransform: viewState.getTransformState(),
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
    const newTransform: TransformState = {
        scale: newScale,
        xOffset: getCenterX() / newScale,
        yOffset: newOffsetY(newScale, getCenterY()),
    }
    updateViewTransform(newTransform)
}
