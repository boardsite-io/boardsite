import { MAX_PIXEL_SCALE } from "consts"
import React, { memo } from "react"
import { useGState, usePageLayer } from "state"
import { PageProps } from "../index.types"
import { useLayerConfig } from "../useLayerConfig"
import { CanvasBG } from "./index.styled"

export const Background: React.FC<PageProps> = memo(({ page, pageOffset }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { layerConfig } = useGState("LayerConfig").view
    useLayerConfig(canvasRef, page)
    usePageLayer("background", page.pageId)

    const pxlScale =
        page.meta.background.style === "doc"
            ? MAX_PIXEL_SCALE
            : layerConfig.pixelScale

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
})
