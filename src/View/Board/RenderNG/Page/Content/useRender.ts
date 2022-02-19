import { StrokeCollection } from "drawing/stroke/index.types"
import { useCustomSelector } from "hooks"
import { useEffect } from "react"
import { draw } from "View/Board/RenderNG/shapes"

export const useRender = (
    strokes: StrokeCollection,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    useCustomSelector((state) => state.board.renderTrigger) // TODO: Only rerender relevant page

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!ctx) return

        Object.values(strokes).forEach((stroke) => {
            draw(ctx, stroke)
            // drawHitboxRects(ctx, stroke) // Hitbox debugging
        })
    })
}
