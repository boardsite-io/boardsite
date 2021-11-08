import React from "react"
import ReactDOM from "react-dom"
import { PDFDocument, PDFPage } from "pdf-lib"
import download from "downloadjs"
import { Provider } from "react-redux"
import { Layer, Stage, Rect } from "react-konva"
import * as types from "konva/lib/Layer"
import { StrokeShape } from "board/stroke/shape"
import { pageType, PIXEL_RATIO } from "consts"
import store from "../redux/store"
import { pageBackground } from "./page"

export async function pagesToDataURL(
    drawBackground?: boolean
): Promise<string[]> {
    const { pageRank } = store.getState().board

    const imgs = pageRank.map(async (pageId: string) => {
        const strokeIds = Object.keys(
            store.getState().board.pageCollection[pageId].strokes
        )
        const { meta } = store.getState().board.pageCollection[pageId]
        const { style } = meta.background
        const { height, width } = meta

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
                            {strokeIds.map((id) => (
                                <StrokeShape
                                    key={id}
                                    stroke={
                                        store.getState().board.pageCollection[
                                            pageId
                                        ]?.strokes[id]
                                    }
                                />
                            ))}
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
        const { width, height, background } = pageCollection[pageRank[i]].meta
        const { style, documentPageNum } = background
        const page =
            style === pageType.DOC
                ? pdf.addPage(pdfPages[documentPageNum])
                : pdf.addPage()
        page.setSize(width, height)
        page.drawImage(pageData, {
            x: 0,
            y: 0,
            width,
            height,
        })
    })

    const pdfBytes = await pdf.save()
    download(pdfBytes, filename, "application/pdf")
}
