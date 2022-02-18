import { StrokeCollection } from "drawing/stroke/index.types"
import { useEffect } from "react"
import { useBoard } from "state/board"
import { draw } from "View/Board/RenderNG/shapes"

export const useRender = (
    strokes: StrokeCollection,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    useBoard("PageContent")

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
