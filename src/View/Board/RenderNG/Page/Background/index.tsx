import { MAX_PIXEL_SCALE } from "consts"
import { useCustomSelector } from "hooks"
import React, { memo } from "react"
import { useLayerState } from "state/view"
import { PageProps } from "../index.types"
import { CanvasBG } from "./index.styled"

export const Background: React.FC<PageProps> = memo(({ page, pageOffset }) => {
    useCustomSelector(
        (state) =>
            state.board.pageCollection[page.pageId]?.meta.background.style
    )

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
