export type LayerConfig = {
    pixelScale: number
}

export type ViewTransform = {
    xOffset: number
    yOffset: number
    scale: number
}

export type PageIndex = number

export type ViewState = {
    pageIndex: PageIndex
    viewTransform: ViewTransform
    layerConfig: LayerConfig
}
