import { DEFAULT_VIEW_TRANSFORM, DEVICE_PIXEL_RATIO } from "consts"
import { LayerState, RenderTrigger, TransformState } from "./index.types"

export class ViewState {
    transformState: TransformState = DEFAULT_VIEW_TRANSFORM
    layerState: LayerState = {
        pixelScale: DEVICE_PIXEL_RATIO,
    }
    transformSubscribers: RenderTrigger[] = []
    layerSubscribers: RenderTrigger[] = []

    getTransformState(): TransformState {
        return this.transformState
    }

    getLayerState(): LayerState {
        return this.layerState
    }

    setViewState(newState: TransformState): void {
        if (this.getTransformState() === newState) return
        this.transformState = newState
        this.renderTransform()
    }

    setLayerState(newState: LayerState): void {
        if (this.getLayerState() === newState) return
        this.layerState = newState
        this.renderLayer()
    }

    subscribeView(itemToSubscribe: RenderTrigger) {
        if (this.transformSubscribers.indexOf(itemToSubscribe) > -1) return
        this.transformSubscribers.push(itemToSubscribe)
    }

    subscribeLayer(itemToSubscribe: RenderTrigger) {
        if (this.layerSubscribers.indexOf(itemToSubscribe) > -1) return
        this.layerSubscribers.push(itemToSubscribe)
    }

    unsubscribeTransform(itemToUnsubscribe: RenderTrigger) {
        this.transformSubscribers = this.transformSubscribers.filter(
            (subscriber) => subscriber !== itemToUnsubscribe
        )
    }

    unsubscribeLayer(itemToUnsubscribe: RenderTrigger) {
        this.layerSubscribers = this.layerSubscribers.filter(
            (subscriber) => subscriber !== itemToUnsubscribe
        )
    }

    renderTransform(): void {
        this.transformSubscribers?.forEach((render) => {
            render({})
        })
    }

    renderLayer(): void {
        this.layerSubscribers?.forEach((render) => {
            render({})
        })
    }
}

export const viewState = new ViewState()
