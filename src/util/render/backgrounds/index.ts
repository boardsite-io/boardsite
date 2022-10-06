import { PDFAttachment } from "drawing/attachment"
import { board } from "state/board"
import { PageMeta, Paper } from "state/board/state/index.types"

export const drawBackground = async (
    ctx: CanvasRenderingContext2D,
    meta: PageMeta
): Promise<void> => {
    const { paper } = meta.background

    ctx.lineWidth = 1
    ctx.strokeStyle = "#00000022"
    ctx.beginPath()
    switch (paper) {
        case Paper.Blank:
            break
        case Paper.Checkered:
            drawCheckered(ctx, meta)
            break
        case Paper.Ruled:
            drawRuled(ctx, meta)
            break
        case Paper.Doc: {
            await drawDocument(ctx, meta)
            break
        }
        default:
            break
    }
    ctx.stroke()
}

const drawCheckered = (ctx: CanvasRenderingContext2D, meta: PageMeta): void => {
    const gap = 15
    const rows = Math.ceil(meta.size.height / gap)
    const columns = Math.ceil(meta.size.width / gap)

    for (let i = 1; i < rows; i += 1) {
        const y = i * gap
        ctx.moveTo(0, y)
        ctx.lineTo(meta.size.width, y)
    }
    for (let i = 1; i < columns; i += 1) {
        const x = i * gap
        ctx.moveTo(x, 0)
        ctx.lineTo(x, meta.size.height)
    }
}

const drawRuled = (ctx: CanvasRenderingContext2D, meta: PageMeta): void => {
    const numRows = 36
    const gap = meta.size.height / numRows

    for (let i = 1; i < numRows; i += 1) {
        const y = i * gap
        ctx.moveTo(0, y)
        ctx.lineTo(meta.size.width, y)
    }

    const boundary = 0.1
    ctx.moveTo(boundary * meta.size.width, 0)
    ctx.lineTo(boundary * meta.size.width, meta.size.height)
    ctx.moveTo((1 - boundary) * meta.size.width, 0)
    ctx.lineTo((1 - boundary) * meta.size.width, meta.size.height)
}

const drawDocument = async (
    ctx: CanvasRenderingContext2D,
    meta: PageMeta
): Promise<void> => {
    const { attachId, documentPageNum } = meta.background

    if (attachId === undefined || documentPageNum === undefined) return

    const attachment = board.getState().attachments[attachId] as PDFAttachment
    const imageData = await attachment.renderDocumentPage(documentPageNum)
    if (!imageData) return

    ctx.putImageData(imageData, 0, 0)
}
