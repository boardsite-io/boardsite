import React from "react"
import ReactDOM from "react-dom"
import { MAX_PIXEL_SCALE } from "consts"
import { Canvas } from "View/Board/RenderNG/Page/index.styled"
import { drawBackground } from "util/render/backgrounds"
import { Page, Paper } from "state/board/state/index.types"
import { draw } from "util/render/shapes"

/**
 * Renders a page as image data.
 * @param page target page to be rendered
 * @returns image data urls
 */
export const pageToDataURL = async (
    page: Page
): Promise<string | undefined> => {
    // dont render pages that are empty and have no background
    // because this would just produce a black image
    if (
        (page.meta.background.paper === Paper.Doc ||
            page.meta.background.paper === Paper.Blank) &&
        Object.keys(page.strokes).length === 0
    ) {
        return undefined
    }

    const tmp = document.createElement("div")
    const canvasRef = React.createRef<HTMLCanvasElement>()

    ReactDOM.render(<Content canvasRef={canvasRef} page={page} />, tmp)

    const ctx = canvasRef.current?.getContext("2d")

    if (ctx) {
        ctx.scale(MAX_PIXEL_SCALE, MAX_PIXEL_SCALE)

        // Draw content layer
        Object.values(page.strokes).forEach((stroke) => {
            draw(ctx, stroke)
        })

        // Draw background layer
        if (page.meta.background.paper !== Paper.Doc) {
            drawBackground(ctx, page.meta)
        }
    }
    const data = canvasRef.current?.toDataURL("image/png", MAX_PIXEL_SCALE)

    tmp.remove()
    return data
}

const Content: React.FC<{
    canvasRef: React.RefObject<HTMLCanvasElement>
    page: Page
}> = ({ canvasRef, page }) => {
    return (
        <Canvas
            ref={canvasRef}
            style={{
                width: page.meta.size.width,
                height: page.meta.size.height,
                left: 0,
                top: 0,
            }}
            width={page.meta.size.width * MAX_PIXEL_SCALE}
            height={page.meta.size.height * MAX_PIXEL_SCALE}
        />
    )
}
