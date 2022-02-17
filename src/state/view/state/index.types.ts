import { Subscribers } from "state/index.types"

export type LayerConfig = {
    pixelScale: number
}

export type ViewTransform = {
    xOffset: number
    yOffset: number
    scale: number
}

export type ViewState = {
    layerConfig: LayerConfig
    viewTransform: ViewTransform
}

export type ViewSubscribers = {
    layerConfig: Subscribers
    viewTransform: Subscribers
}

export type ViewSubscription = keyof ViewSubscribers
