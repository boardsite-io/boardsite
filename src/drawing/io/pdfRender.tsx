import React from "react"
import ReactDOM from "react-dom"
import { PDFDocument, PDFImage, PDFPage } from "pdf-lib"
import { Provider } from "react-redux"
import store from "redux/store"
import { Layer, Stage, Rect } from "react-konva"
import * as types from "konva/lib/Layer"
import Shape from "View/BoardStage/Shape"
import { LineCap, LineJoin } from "konva/lib/Shape"
import { backgroundStyle, PDF_EXPORT_PIXEL_RATIO } from "consts"
import { pageBackground } from "drawing/page/backgrounds"
import { AttachId, PageMeta } from "redux/board/index.types"

export const getPdfBytes = async (): Promise<Uint8Array> => {
    const { pageRank, pageCollection } = store.getState().board
    const pdfDocuments: Record<AttachId, PDFPage[]> = {}
    const pdf = await PDFDocument.create()

    const pageImages = await Promise.all(
        pageRank.map(async (pageId) => {
            const data = await pageToDataURL(pageId, true)
            if (data && data.length !== 0) {
                return pdf.embedPng(data)
            }
            return null
        })
    )

    // return the correct background pdf page if any
    const getBasePage = async (
        meta: PageMeta
    ): Promise<PDFPage | undefined> => {
        let basePage: PDFPage | undefined
        const { style, attachId, documentPageNum } = meta.background
        if (
            style === backgroundStyle.DOC &&
            documentPageNum !== undefined &&
            attachId
        ) {
            if (!pdfDocuments[attachId]) {
                // if document is not loaded yet (loaded by pdf-lib)
                const attachment = store.getState().board.attachments[attachId]
                const src = await PDFDocument.load(attachment.cachedBlob)
                pdfDocuments[attachId] = await pdf.copyPages(src, [
                    ...Array(src.getPages().length).keys(),
                ])
            }
            basePage = pdfDocuments[attachId][documentPageNum]
        }
        return basePage
    }

    for (let i = 0; i < pageImages.length; i++) {
        const { meta } = pageCollection[pageRank[i]]
        const { size } = meta
        const basePage = await getBasePage(meta)

        const page = pdf.addPage(basePage)
        page.setSize(size.width, size.height)
        if (pageImages[i]) {
            page.drawImage(pageImages[i] as PDFImage, {
                x: 0,
                y: 0,
                width: size.width,
                height: size.height,
            })
        }
    }

    const pdfBytes = await pdf.save()

    return pdfBytes
}

/**
 * Renders a page as image data.
 * @param drawBackground draw the page background (ruled, checkered)
 * @returns image data urls
 */
async function pageToDataURL(
    pageId: string,
    drawBackground?: boolean
): Promise<string | undefined> {
    const strokeIds = Object.keys(
        store.getState().board.pageCollection[pageId].strokes
    )

    // no strokes on this page
    if (strokeIds.length === 0) {
        return ""
    }

    const { background, size } =
        store.getState().board.pageCollection[pageId].meta
    const { style } = background
    const { height, width } = size

    const tmp = document.createElement("div")

    let ref: React.Ref<types.Layer> = null
    const LayerTest = () => {
        ref = React.useRef<types.Layer>(null)
        return (
            <Stage height={height} width={width}>
                <Provider store={store}>
                    <Layer ref={ref}>
                        <Rect
                            height={height}
                            width={width}
                            sceneFunc={
                                drawBackground
                                    ? pageBackground[style]
                                    : undefined
                            }
                        />
                        {strokeIds.map((id) => {
                            const stroke =
                                store.getState().board.pageCollection[pageId]
                                    ?.strokes[id]
                            if (!stroke) return null

                            const pdfShapeProps = {
                                name: stroke.pageId,
                                id: stroke.id,
                                x: stroke.x,
                                y: stroke.y,
                                scaleX: stroke.scaleX,
                                scaleY: stroke.scaleY,
                                lineCap: "round" as LineCap,
                                lineJoin: "round" as LineJoin,
                                stroke: stroke.style.color,
                                fill: undefined,
                                strokeWidth: stroke.style.width,
                                opacity: stroke.style.opacity,
                                listening: false,
                                draggable: false,
                                onDragStart: undefined,
                                onDragEnd: undefined,
                                shadowForStrokeEnabled: false,
                                points: stroke.points,
                            }

                            return (
                                <Shape
                                    key={id}
                                    stroke={
                                        store.getState().board.pageCollection[
                                            pageId
                                        ]?.strokes[id]
                                    }
                                    shapeProps={pdfShapeProps}
                                />
                            )
                        })}
                    </Layer>
                </Provider>
            </Stage>
        )
    }
    ReactDOM.render(<LayerTest />, tmp)
    const data = (
        ref as unknown as React.RefObject<types.Layer>
    )?.current?.toDataURL({
        pixelRatio: PDF_EXPORT_PIXEL_RATIO,
    })
    tmp.remove()
    return data
}
