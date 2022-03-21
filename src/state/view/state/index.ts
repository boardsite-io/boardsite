import {
    DEFAULT_VIEW_OFFSET_Y,
    DEFAULT_VIEW_SCALE,
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
import { LayerConfig, ViewTransform, ViewState } from "./index.types"

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

    updateViewTransform(newTransform: ViewTransform): void {
        const detectionResult = detectPageChange(newTransform)

        if (detectionResult === DetectionResult.Next) {
            newTransform = toNextPage(newTransform)
            board.incrementPageIndex()
        } else if (detectionResult === DetectionResult.Previous) {
            newTransform = toPreviousPage(newTransform)
            board.decrementPageIndex()
        }
        newTransform = applyBounds(newTransform)

        view.setTransformState(newTransform)
        this.checkPixelScaleDebounced(newTransform)
    }

    checkPixelScale(newTransform: ViewTransform): void {
        const pixelScale = Math.min(
            DEVICE_PIXEL_RATIO * Math.ceil(newTransform.scale),
            MAX_PIXEL_SCALE
        )

        if (pixelScale !== this.getLayerConfig().pixelScale) {
            this.setLayerConfig({
                pixelScale,
            })
        }
    }

    checkPixelScaleDebounced = debounce(
        this.checkPixelScale,
        TRANSFORM_PIXEL_SCALE_DEBOUNCE
    )

    zoomCenter(isZoomingIn: boolean): void {
        const newTransform = zoomTo({
            viewTransform: view.getViewTransform(),
            zoomPoint: getCenterOfScreen(),
            zoomScale: isZoomingIn ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
        })

        this.updateViewTransform(newTransform)
    }

    resetView(): void {
        this.updateViewTransform({
            scale: DEFAULT_VIEW_SCALE,
            xOffset: getCenterX(),
            yOffset: DEFAULT_VIEW_OFFSET_Y,
        })
    }

    private scaleWithFixedY(newScale: number, yFixed: number): number {
        const { scale, yOffset } = this.getViewTransform()

        return yOffset + yFixed / newScale - yFixed / scale
    }

    private rescaleAtCenter(newScale: number): void {
        const newTransform = {
            scale: newScale,
            xOffset: getCenterX() / newScale,
            yOffset: this.scaleWithFixedY(newScale, getCenterY()),
        }
        this.updateViewTransform(newTransform)
    }

    resetViewScale(): void {
        this.rescaleAtCenter(1)
    }

    fitToPage(): void {
        this.rescaleAtCenter(window.innerWidth / board.getPageSize().width)
    }

    getViewTransform(): ViewTransform {
        return this.state.viewTransform
    }

    getLayerConfig(): LayerConfig {
        return this.state.layerConfig
    }

    setTransformState(newState: ViewTransform): void {
        this.state.viewTransform = newState
        subscriptionState.render("ViewTransform")
    }

    setLayerConfig(newState: LayerConfig): void {
        this.state.layerConfig = newState
        subscriptionState.render("LayerConfig")
    }
}

export const view = new View()
