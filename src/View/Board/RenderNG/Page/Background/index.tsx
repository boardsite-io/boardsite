import { MAX_PIXEL_SCALE } from "consts"
import React, { memo } from "react"
import { usePageLayer } from "state/board"
import { useLayerState } from "state/view"
import { PageProps } from "../index.types"
import { CanvasBG } from "./index.styled"

export const Background: React.FC<PageProps> = memo(({ page, pageOffset }) => {
    usePageLayer("background", page.pageId)

    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const layerState = useLayerState(canvasRef, page)

    const pxlScale =
        page.meta.background.style === "doc"
            ? MAX_PIXEL_SCALE
            : layerState.pixelScale

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
