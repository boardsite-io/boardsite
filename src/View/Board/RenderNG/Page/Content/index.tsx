import React, { memo } from "react"
import { useLayerState } from "state/view"
import { Canvas } from "../index.styled"
import { useRender } from "./useRender"
import { PageProps } from "../index.types"

export const Content: React.FC<PageProps> = memo(({ page, pageOffset }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const layerState = useLayerState(canvasRef)

    useRender(page, canvasRef)

    return (
        <Canvas
            ref={canvasRef}
            style={{
                width: page.meta.size.width,
                height: page.meta.size.height,
                left: pageOffset.left,
                top: pageOffset.top,
            }}
            width={page.meta.size.width * layerState.pixelScale}
            height={page.meta.size.height * layerState.pixelScale}
        />
    )
})
