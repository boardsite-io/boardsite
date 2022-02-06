import React, { useCallback, useEffect, useState } from "react"
import { Page } from "redux/board/index.types"
import { drawBackground } from "View/Board/RenderNG/Page/Background/backgrounds"
import { viewState } from "./ViewState"

export const useLayerState = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    page?: Page
) => {
    const [, render] = useState<object>({})
    const reRender = useCallback(() => render({}), [])

    useEffect(() => {
        viewState.subscribeLayer(reRender)

        return () => {
            viewState.unsubscribeLayer(reRender)
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (!page) {
            ctx.setTransform(1, 0, 0, 1, 0, 0) // reset last transform
            const { pixelScale } = viewState.getLayerState()
            ctx.scale(pixelScale, pixelScale)
        } else {
            if (page.meta.background.style !== "doc") {
                ctx.setTransform(1, 0, 0, 1, 0, 0) // reset last transform
                const { pixelScale } = viewState.getLayerState()
                ctx.scale(pixelScale, pixelScale)
            }

            drawBackground(ctx, page.meta)
        }
    })

    return viewState.getLayerState()
}
