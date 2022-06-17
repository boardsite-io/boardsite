import React, { memo } from "react"
import { useGState } from "state"
import { useLayerConfig } from "hooks"
import { Canvas } from "../index.styled"
import { useRender } from "./useRender"
import { PageProps } from "../index.types"

export const Content: React.FC<PageProps> = memo(({ page, pageOffset }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { layerConfig } = useGState("LayerConfig").view

    useLayerConfig(canvasRef)
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
            width={page.meta.size.width * layerConfig.pixelScale}
            height={page.meta.size.height * layerConfig.pixelScale}
        />
    )
})
