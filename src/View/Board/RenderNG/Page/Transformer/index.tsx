import React, { memo } from "react"
import { useGState } from "state"
import { PageProps } from "../index.types"
import { useLayerConfig } from "../useLayerConfig"
import {
    TrCanvas,
    TrCanvasHandle,
    TrHandle,
    SelectionTransformer,
    TrWrap,
} from "./index.styled"
import { useTransformer } from "./useTransformer"

export const Transformer: React.FC<PageProps> = memo(({ page, pageOffset }) => {
    const trRef = React.useRef<HTMLDivElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { layerConfig } = useGState("LayerConfig").view
    useLayerConfig(canvasRef)

    const {
        trCoords,
        transformStrokes,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel,
    } = useTransformer(trRef, canvasRef, pageOffset, page)

    if (
        transformStrokes === undefined ||
        transformStrokes.length === 0 ||
        transformStrokes[0].pageId !== page.pageId
    ) {
        return null
    }

    return (
        <TrWrap
            style={{
                width: page.meta.size.width,
                height: page.meta.size.height,
                left: pageOffset.left,
                top: pageOffset.top,
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
        >
            <SelectionTransformer
                ref={trRef}
                style={{
                    left: trCoords.left,
                    top: trCoords.top,
                }}
            >
                <TrCanvas
                    id="tr-canvas"
                    ref={canvasRef}
                    style={{
                        width: trCoords.width,
                        height: trCoords.height,
                    }}
                    width={trCoords.width * layerConfig.pixelScale}
                    height={trCoords.height * layerConfig.pixelScale}
                />
                {[
                    TrHandle.Top,
                    TrHandle.TopRight,
                    TrHandle.Right,
                    TrHandle.BottomRight,
                    TrHandle.Bottom,
                    TrHandle.BottomLeft,
                    TrHandle.Left,
                    TrHandle.TopLeft,
                ].map((handlePosition) => (
                    <TrCanvasHandle
                        key={handlePosition}
                        id={`tr-handle-${handlePosition}`}
                        position={handlePosition}
                    />
                ))}
            </SelectionTransformer>
        </TrWrap>
    )
})
