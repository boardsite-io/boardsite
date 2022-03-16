import React, { memo } from "react"
import { useGState } from "state"
import { Canvas } from "../index.styled"
import { PageProps } from "../index.types"
import { useLayerConfig } from "../useLayerConfig"
import { useLiveStroke } from "./useLiveStroke"

export const Live: React.FC<PageProps> = memo(({ page, pageOffset }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    const {
        isPanMode,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel,
    } = useLiveStroke(page.pageId, canvasRef, pageOffset)
    const { layerConfig } = useGState("LayerConfig").view
    useLayerConfig(canvasRef)

    return (
        <Canvas
            ref={canvasRef}
            style={{
                background: "transparent",
                touchAction: isPanMode ? "none" : undefined,
                width: page.meta.size.width,
                height: page.meta.size.height,
                left: pageOffset.left,
                top: pageOffset.top,
            }}
            width={page.meta.size.width * layerConfig.pixelScale}
            height={page.meta.size.height * layerConfig.pixelScale}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
        />
    )
})
