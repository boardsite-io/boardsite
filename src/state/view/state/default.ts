import {
    DEFAULT_CURRENT_PAGE_INDEX,
    DEFAULT_VIEW_TRANSFORM,
    DEVICE_PIXEL_RATIO,
} from "consts"
import { ViewState } from "./index.types"

export const getDefaultViewState = (): ViewState => ({
    pageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    viewTransform: DEFAULT_VIEW_TRANSFORM,
    layerConfig: {
        pixelScale: DEVICE_PIXEL_RATIO,
    },
})
