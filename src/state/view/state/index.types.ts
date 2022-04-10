import { SerializedVersionState } from "state/types"

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

export type SerializedViewState = SerializedVersionState<
    Pick<ViewState, "pageIndex">
>
