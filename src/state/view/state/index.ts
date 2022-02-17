import { DEFAULT_VIEW_TRANSFORM, DEVICE_PIXEL_RATIO } from "consts"
import { GlobalState, RenderTrigger } from "../../index.types"
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

    subscribe(trigger: RenderTrigger, subscription: ViewSubscription) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(trigger: RenderTrigger, subscription: ViewSubscription) {
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
