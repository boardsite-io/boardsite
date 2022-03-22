import {
    DEFAULT_VIEW_TRANSFORM,
    DEVICE_PIXEL_RATIO,
    MAX_PIXEL_SCALE,
    TRANSFORM_PIXEL_SCALE_DEBOUNCE,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
} from "consts"
import { debounce } from "lodash"
import { board } from "state/board"
import { subscriptionState } from "state/subscription"
import { GlobalState } from "../../types"
import {
    applyBounds,
    DetectionResult,
    detectPageChange,
    getCenterOfScreen,
    getCenterX,
    getCenterY,
    toNextPage,
    toPreviousPage,
    zoomTo,
} from "../util"
import { ViewTransform, ViewState } from "./index.types"

export class View implements GlobalState<ViewState> {
    state: ViewState = {
        viewTransform: DEFAULT_VIEW_TRANSFORM,
        layerConfig: {
            pixelScale: DEVICE_PIXEL_RATIO,
        },
    }

    getState(): ViewState {
        return this.state
    }

    setState(newState: ViewState) {
        this.state = newState
    }

    /**
     * Zoom to the center of the screen
     * @param isZoomingIn set to true to zoom in
     */
    zoomCenter(isZoomingIn: boolean): void {
        const newTransform = zoomTo({
            viewTransform: this.getState().viewTransform,
            zoomPoint: getCenterOfScreen(),
            zoomScale: isZoomingIn ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
        })

        this.updateViewTransform(newTransform)
    }

    /**
     * Reset the view transform to the default values
     */
    resetView(): void {
        this.updateViewTransform({
            scale: DEFAULT_VIEW_TRANSFORM.scale,
            xOffset: getCenterX(),
            yOffset: DEFAULT_VIEW_TRANSFORM.yOffset,
        })
    }

    /**
     * Reset the view scale at the center of the screen
     */
    resetViewScale(): void {
        this.rescaleAtCenter(1)
    }

    /**
     * Set the view scale so that the current page fits the viewport width
     */
    fitToPage(): void {
        this.rescaleAtCenter(window.innerWidth / board.getPageSize().width)
    }

    /**
     * Update the view transform. Bounds and a pixel scale update are applied if necessary
     * @param newTransform transform update to be applied
     */
    updateViewTransform(newTransform: ViewTransform): void {
        const detectionResult = detectPageChange(newTransform)

        if (detectionResult === DetectionResult.Next) {
            newTransform = toNextPage(newTransform)
            board.jumpToNextPage()
        } else if (detectionResult === DetectionResult.Previous) {
            newTransform = toPreviousPage(newTransform)
            board.jumpToPrevPage()
        }
        newTransform = applyBounds(newTransform)

        this.state.viewTransform = newTransform
        this.checkPixelScaleDebounced(newTransform)

        subscriptionState.render("ViewTransform")
    }

    /**
     * Debounced pixel scale check
     */
    private checkPixelScaleDebounced = debounce(
        this.checkPixelScale,
        TRANSFORM_PIXEL_SCALE_DEBOUNCE
    )

    /**
     * Check if the pixel scale needs adjustment and apply if necessary.
     * @param newTransform new viewTransform which could trigger a rescale
     */
    private checkPixelScale(newTransform: ViewTransform): void {
        const newPixelScale = Math.min(
            DEVICE_PIXEL_RATIO * Math.ceil(newTransform.scale),
            MAX_PIXEL_SCALE
        )

        if (newPixelScale !== this.getState().layerConfig.pixelScale) {
            this.state.layerConfig = {
                pixelScale: newPixelScale,
            }
            subscriptionState.render("LayerConfig")
        }
    }

    /**
     * Get the yOffset at which a rescale will not
     * change the position at a specified y coordinate
     * @param newScale new scale to be applied
     * @param yFixed y coordinate at which the view should rescale at
     * @returns new yOffset
     */
    private scaleWithFixedY(
        newScale: number,
        yFixed: number
    ): ViewTransform["yOffset"] {
        const { scale, yOffset } = this.getState().viewTransform

        return yOffset + yFixed / newScale - yFixed / scale
    }

    /**
     * Rescale the view at the center of the viewport
     * @param newScale new scale to be applied
     */
    private rescaleAtCenter(newScale: number): void {
        const newTransform = {
            scale: newScale,
            xOffset: getCenterX() / newScale,
            yOffset: this.scaleWithFixedY(newScale, getCenterY()),
        }
        this.updateViewTransform(newTransform)
    }
}

export const view = new View()
