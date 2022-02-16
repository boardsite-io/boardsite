import React, { useCallback, useEffect, useState } from "react"
import { Page } from "redux/board/index.types"
import { drawBackground } from "View/Board/RenderNG/Page/Background/backgrounds"
import { view } from "../state"

export const useLayerState = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    page?: Page
) => {
    const [, render] = useState<object>({})
    const reRender = useCallback(() => render({}), [])

    useEffect(() => {
        view.subscribe(reRender, "layerConfig")

        return () => {
            view.unsubscribe(reRender, "layerConfig")
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
            const { pixelScale } = view.getLayerConfig()
            ctx.scale(pixelScale, pixelScale)
        } else {
            if (page.meta.background.style !== "doc") {
                ctx.setTransform(1, 0, 0, 1, 0, 0) // reset last transform
                const { pixelScale } = view.getLayerConfig()
                ctx.scale(pixelScale, pixelScale)
            }

            drawBackground(ctx, page.meta)
        }
    })

    return view.getLayerConfig()
}
