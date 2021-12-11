import React from "react"
import ReactDOM from "react-dom"
import { PDFDocument, PDFPage } from "pdf-lib"
import download from "downloadjs"
import { Provider } from "react-redux"
import store from "redux/store"
import { Layer, Stage, Rect } from "react-konva"
import * as types from "konva/lib/Layer"
import { Shape } from "board/stroke/shape"
import { LineCap, LineJoin } from "konva/lib/Shape"
import { backgroundStyle, PIXEL_RATIO } from "consts"
import { SET_PDF } from "redux/board/board"
import { DocumentSrc } from "redux/board/board.types"
import { pageBackground } from "drawing/page/backgrounds"
import { sourceToImageData } from "./document"

export async function handleLoadFromSource(
    fileOriginSrc: DocumentSrc
): Promise<void> {
    const documentImages = await sourceToImageData(fileOriginSrc)

    store.dispatch(
        SET_PDF({
            documentImages,
            documentSrc: fileOriginSrc,
        })
    )
}

export async function pagesToDataURL(
    drawBackground?: boolean
): Promise<string[]> {
    const { pageRank } = store.getState().board

    const imgs = pageRank.map(async (pageId: string) => {
        const strokeIds = Object.keys(
            store.getState().board.pageCollection[pageId].strokes
        )
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
                                    store.getState().board.pageCollection[
                                        pageId
                                    ]?.strokes[id]
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
                                            store.getState().board
                                                .pageCollection[pageId]
                                                ?.strokes[id]
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
            pixelRatio: PIXEL_RATIO,
        })
        tmp.remove()
        return data ?? ""
    })

    return Promise.all(imgs)
}

export async function toPDF(
    filename: string,
    baseDocument?: string | Uint8Array
): Promise<void> {
    const pdf = await PDFDocument.create()
    let pdfPages: PDFPage[]
    if (baseDocument) {
        const pdfSrcDoc = await PDFDocument.load(baseDocument)
        // copy all pages from source document and later select
        // only those that are used
        pdfPages = await pdf.copyPages(pdfSrcDoc, [
            ...Array(pdfSrcDoc.getPages().length).keys(),
        ])
    }

    // embedd images in document
    // TODO set draw background
    const pagesData = await pagesToDataURL(true)
    const pageImages = await Promise.all(
        pagesData.map((data) => pdf.embedPng(data))
    )
    const { pageRank, pageCollection } = store.getState().board

    pageImages.forEach((pageData, i) => {
        const { size, background } = pageCollection[pageRank[i]].meta
        const { style, documentPageNum } = background
        const page =
            style === backgroundStyle.DOC && documentPageNum !== undefined
                ? pdf.addPage(pdfPages[documentPageNum])
                : pdf.addPage()
        page.setSize(size.width, size.height)
        page.drawImage(pageData, {
            x: 0,
            y: 0,
            width: size.width,
            height: size.height,
        })
    })

    const pdfBytes = await pdf.save()
    download(pdfBytes, filename, "application/pdf")
}
