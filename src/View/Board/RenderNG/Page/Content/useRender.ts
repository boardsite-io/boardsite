import { useEffect } from "react"
import { Page } from "state/board/state/index.types"
import { useGState, usePageLayer } from "state"
import { draw, drawErased } from "util/render/shapes"

export const useRender = (
    page: Page,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    usePageLayer("content", page.pageId)

    const { erasedStrokes } = useGState("PageContent").drawing

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!ctx) return

        Object.values(page.strokes).forEach((stroke) => {
            if (erasedStrokes[stroke.id]) {
                drawErased(ctx, stroke)
            } else {
                draw(ctx, stroke)
            }
            // drawHitboxRects(ctx, stroke) // Hitbox debugging
        })
    })
}
