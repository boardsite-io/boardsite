import { useEffect } from "react"
import { usePageLayer } from "state/board"
import { Page } from "state/board/state/index.types"
import { useDrawing } from "state/drawing"
import { draw, drawErased } from "View/Board/RenderNG/shapes"

export const useRender = (
    page: Page,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    usePageLayer("content", page.pageId)

    const { erasedStrokes } = useDrawing("PageContent")

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
