import React, { useEffect } from "react"
import { Page, Paper } from "state/board/state/index.types"
import { view } from "state/view"
import { drawBackground } from "View/Board/RenderNG/Page/Background/backgrounds"

export const useLayerConfig = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    page?: Page
) => {
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (!page) {
            ctx.setTransform(1, 0, 0, 1, 0, 0) // reset last transform
            const { pixelScale } = view.getState().layerConfig
            ctx.scale(pixelScale, pixelScale)
        } else {
            if (page.meta.background.paper !== Paper.Doc) {
                ctx.setTransform(1, 0, 0, 1, 0, 0) // reset last transform
                const { pixelScale } = view.getState().layerConfig
                ctx.scale(pixelScale, pixelScale)
            }

            drawBackground(ctx, page.meta)
        }
    })
}
