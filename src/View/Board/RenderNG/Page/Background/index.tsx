import { MAX_PIXEL_SCALE } from "consts"
import React, { memo } from "react"
import { useLayerConfig } from "hooks"
import { useGState, usePageLayer } from "state"
import { Paper } from "state/board/state/index.types"
import { isEqual } from "lodash"
import { PageProps } from "../index.types"
import { CanvasBG } from "./index.styled"

const backgroundEq = (prev: PageProps, next: PageProps) => {
    return (
        isEqual(prev.page.meta, next.page.meta) &&
        isEqual(prev.pageOffset, next.pageOffset)
    )
}

export const Background: React.FC<PageProps> = memo(({ page, pageOffset }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { layerConfig } = useGState("LayerConfig").view
    const pxlScale =
        page.meta.background.paper === Paper.Doc
            ? MAX_PIXEL_SCALE
            : layerConfig.pixelScale

    useLayerConfig(canvasRef, page)
    usePageLayer("background", page.pageId)

    return (
        <CanvasBG
            ref={canvasRef}
            style={{
                width: page.meta.size.width,
                height: page.meta.size.height,
                left: pageOffset.left,
                top: pageOffset.top,
            }}
            width={page.meta.size.width * pxlScale}
            height={page.meta.size.height * pxlScale}
        />
    )
}, backgroundEq)
