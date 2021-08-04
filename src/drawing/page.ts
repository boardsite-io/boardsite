import { nanoid } from "@reduxjs/toolkit"
import { Shape, ShapeConfig } from "konva/types/Shape"
import { Context } from "konva/types/Context"
// eslint-disable-next-line import/no-unresolved
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"
// import pdfjsWorker from "pdfjs-dist/es5/build/pdf.worker.entry"
import { RenderParameters } from "pdfjs-dist/types/display/api"

import { DOC_SCALE, pageType } from "../constants"
import {
    ADD_PAGE,
    DELETE_ALL_PAGES,
    SET_PDF,
} from "../redux/slice/boardcontrol"
import store from "../redux/store"
import { Page, PageBackground, PageMeta, StrokeMap } from "../types"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfjsWorker: any = require("pdfjs-dist/legacy/build/pdf.worker.entry")

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export class BoardPage implements Page {
    constructor(style?: PageBackground, pageNum?: number) {
        this.pageId = nanoid(8)
        this.meta = {
            background: {
                style: style ?? store.getState().boardControl.pageBG, // fallback type
                pageNum: pageNum ?? -1,
            },
        }
    }

    pageId: string
    strokes: StrokeMap = {}
    meta: PageMeta

    setID(pageId: string): BoardPage {
        this.pageId = pageId
        return this
    }

    add(index?: number): void {
        store.dispatch(ADD_PAGE({ page: this, index }))
    }

    clear(): void {
        this.strokes = {}
    }

    updateMeta(meta: PageMeta): void {
        // update only fields that are different
        this.meta = { ...this.meta, ...meta }
    }

    updateBackground(style: PageBackground): void {
        // cannot change background of document
        if (this.meta.background.style !== pageType.DOC) {
            this.meta.background.style = style
        }
    }
}

export async function getPDFfromForm(file: File): Promise<Uint8Array> {
    const fileReader = new FileReader()
    const p = new Promise<Uint8Array>((resolve) => {
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line func-names
        fileReader.onload = function () {
            resolve(new Uint8Array(this.result as ArrayBuffer))
        }
    })
    fileReader.readAsArrayBuffer(file)
    return p
}

export async function loadNewPDF(fileData: Uint8Array | URL): Promise<void> {
    const pdf = await pdfjs.getDocument(fileData).promise

    // get number of pages for document
    // eslint-disable-next-line no-underscore-dangle
    const { numPages } = pdf._pdfInfo
    let pages = new Array(numPages).fill(null)

    // process all pages by drawing them in a canvas
    // and saving the image data
    pages = pages.map(async (_, i) => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        const docPage = await pdf.getPage(i + 1)
        const viewport = docPage.getViewport({ scale: DOC_SCALE })

        canvas.height = viewport.height
        canvas.width = viewport.width

        const render = docPage.render({
            canvasContext: ctx,
            viewport,
            enableWebGL: true,
        } as RenderParameters)

        const renderTask = new Promise((resolve, reject) => {
            // eslint-disable-next-line no-underscore-dangle
            render._internalRenderTask.callback = (error: unknown) => {
                if (error !== undefined) {
                    reject()
                } else {
                    resolve(undefined)
                }
            }
        })

        // wait until pdf render is finished
        await renderTask
        const img = document.createElement("img")
        img.src = canvas.toDataURL("image/png")
        canvas.remove()

        return img
    })

    // save loaded pages in store
    const data = await Promise.all(pages)
    store.dispatch(SET_PDF(data))

    store.dispatch(DELETE_ALL_PAGES())
    pages.forEach((_, i) => {
        const page = new BoardPage(pageType.DOC, i + 1)
        page.add(-1) // append subsequent pages at the end
    })
}

const blank = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)
}

const checkered = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)

    // make checkered math paper
    const gap = 20
    const rows = Math.ceil(height / gap)
    const columns = Math.ceil(width / gap)
    for (let i = 1; i < rows; i += 1) {
        const y = i * gap
        context.moveTo(0, y)
        context.lineTo(width, y)
    }
    for (let i = 1; i < columns; i += 1) {
        const x = i * gap
        context.moveTo(x, 0)
        context.lineTo(x, height)
    }
    context.setAttr("strokeStyle", "#00000088")
    context.stroke()
}

const ruled = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)

    const numRows = 30
    // make ruled math paper
    const gap = height / numRows
    for (let i = 1; i < numRows; i += 1) {
        const y = i * gap
        context.moveTo(0, y)
        context.lineTo(width, y)
    }
    context.setAttr("strokeStyle", "#00000088")
    context.stroke()
}

export const pageBackground = {
    [pageType.BLANK]: blank,
    [pageType.CHECKERED]: checkered,
    [pageType.RULED]: ruled,
}
