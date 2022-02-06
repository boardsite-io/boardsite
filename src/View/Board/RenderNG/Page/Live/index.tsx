import React, { memo } from "react"
import { useLayerState } from "state/view"
import { Canvas } from "../index.styled"
import { PageProps } from "../index.types"
import { useLiveStroke } from "./useLiveStroke"

export const Live: React.FC<PageProps> = memo(
    ({ page, pageOffset: pageInfo }) => {
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
        } = useLiveStroke(page.pageId, canvasRef)

        const layerState = useLayerState(canvasRef)

        return (
            <Canvas
                ref={canvasRef}
                style={{
                    touchAction: isPanMode ? "none" : undefined,
                    width: page.meta.size.width,
                    height: page.meta.size.height,
                    left: pageInfo.left,
                    top: pageInfo.top,
                }}
                width={page.meta.size.width * layerState.pixelScale}
                height={page.meta.size.height * layerState.pixelScale}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            />
        )
    }
)
