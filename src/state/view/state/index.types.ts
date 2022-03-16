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
