import { nanoid } from "@reduxjs/toolkit"
import * as pdfjs from "pdfjs-dist/es5/build/pdf"
import pdfjsWorker from "pdfjs-dist/es5/build/pdf.worker.entry"

import { DOC_SCALE, pageType } from "../constants"
import {
    ADD_PAGE,
    DELETE_ALL_PAGES,
    SET_PDF,
} from "../redux/slice/boardcontrol"
import store from "../redux/store"

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export function newPage(index, style, pageNum) {
    return {
        pageId: nanoid(8),
        index,
        meta: newPageMeta(style, pageNum),
    }
}

export function newPageMeta(
    style = store.getState().drawControl.pageBG,
    pageNum = -1
) {
    return {
        background: {
            style,
            pageNum,
        },
    }
}

export async function getPDFfromForm(file) {
    const fileReader = new FileReader()
    const p = new Promise((resolve) => {
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line func-names
        fileReader.onload = function () {
            resolve(new Uint8Array(this.result))
        }
    })
    fileReader.readAsArrayBuffer(file)
    return p
}

export async function loadNewPDF(file) {
    const pdf = await pdfjs.getDocument(file).promise

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

        ctx.fillStyle = "red"
        ctx.fillRect(0, 0, 100, 100)

        const render = docPage.render({
            canvasContext: ctx,
            viewport,
            enableWebGL: true,
        })

        const renderTask = new Promise((resolve, reject) => {
            // eslint-disable-next-line no-underscore-dangle
            render._internalRenderTask.callback = (error) => {
                if (error !== undefined) {
                    reject()
                } else {
                    resolve()
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
        // append subsequent pages at the end
        const page = newPage(-1, pageType.DOC, i + 1)
        store.dispatch(ADD_PAGE(page))
    })
}

const blank = (context, shape) => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)
}

const checkered = (context, shape) => {
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

const ruled = (context, shape) => {
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
