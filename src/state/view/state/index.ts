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
import { GlobalState, RenderTrigger } from "../../index.types"
import {
    applyBounds,
    DetectionResult,
    detectPageChange,
    getCenterOfScreen,
    getCenterX,
    getCenterY,
    getPageSize,
    toNextPage,
    toPreviousPage,
    zoomTo,
} from "../util"
import {
    LayerConfig,
    ViewTransform,
    ViewState,
    ViewSubscribers,
    ViewSubscription,
} from "./index.types"

export class View implements GlobalState<ViewState, ViewSubscribers> {
    state: ViewState = {
        viewTransform: DEFAULT_VIEW_TRANSFORM,
        layerConfig: {
            pixelScale: DEVICE_PIXEL_RATIO,
        },
    }

    subscribers: ViewSubscribers = {
        viewTransform: [],
        layerConfig: [],
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
        this.rescaleAtCenter(window.innerWidth / getPageSize().width)
    }

    setState(newState: ViewState) {
        this.state = newState
    }

    getState(): ViewState {
        return this.state
    }

    getViewTransform(): ViewTransform {
        return this.state.viewTransform
    }

    getLayerConfig(): LayerConfig {
        return this.state.layerConfig
    }

    setTransformState(newState: ViewTransform): void {
        this.state.viewTransform = newState
        this.render("viewTransform")
    }

    setLayerConfig(newState: LayerConfig): void {
        this.state.layerConfig = newState
        this.render("layerConfig")
    }

    subscribe(subscription: ViewSubscription, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: ViewSubscription, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(subscription: ViewSubscription): void {
        this.subscribers[subscription].forEach((render) => {
            render({})
        })
    }
}

export const view = new View()
