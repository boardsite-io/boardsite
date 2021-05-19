import { nanoid } from "@reduxjs/toolkit"
import * as pdfjs from "pdfjs-dist/es5/build/pdf"
import pdfjsWorker from "pdfjs-dist/es5/build/pdf.worker.entry"

import { pageType } from "../constants"
import { SET_PDF } from "../redux/slice/boardcontrol"
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

export async function loadNewPDF(file) {
    const fileReader = new FileReader()
    const p = new Promise((resolve) => {
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line func-names
        fileReader.onload = function () {
            resolve(new Uint8Array(this.result))
        }
    })
    fileReader.readAsArrayBuffer(file)
    const pdf = await pdfjs.getDocument(await p).promise

    // get number of pages for document
    // eslint-disable-next-line no-underscore-dangle
    const { numPages } = pdf._pdfInfo
    console.log(`loaded pdf file with ${numPages} pages`)
    let pages = new Array(numPages).fill(null)

    // process all pages by drawing them in a canvas
    // and saving the image data
    pages = pages.map(async (_, i) => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        const docPage = await pdf.getPage(i + 1)
        const viewport = docPage.getViewport({ scale: 1 })

        canvas.height = viewport.height
        canvas.width = viewport.width
        await docPage.render({
            canvasContext: ctx,
            viewport,
        })

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        canvas.remove()
        console.log(`Image data for page ${i + 1}`, data)
        return data
    })

    // save loaded pages in store
    const data = await Promise.all(pages)
    store.dispatch(SET_PDF(data))
    console.log(`loaded ${pages.length} pages`, data)
    console.log(store.getState().boardControl.docs)

    // store.dispatch(DELETE_ALL_PAGES())
    // pages.forEach((_, i) => {
    //     const page = newPage(-1, pageType.BLANK, i + 1)
    //     store.dispatch(ADD_PAGE(page))
    //     store.dispatch(
    //         SET_PAGEMETA({
    //             pageId: page.pageId,
    //             meta: newPageMeta(pageType.DOC, i + 1),
    //         })
    //     )
    // })
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

    // (!) Konva specific method, it is very important
    // it will apply are required styles
    // context.fillStrokeShape(shape)
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

const doc = () => {
    // context.beginPath()
    // const { pageNum } = store.getState().boardControl.pageCollection[
    //     pageId
    // ].meta.background
    // console.log(`render page ${pageId} with document page ${pageNum}`)
    // const docPage = store.getState().boardControl.docs[pageNum - 1]
    // docPage.render({
    //     canvasContext: context,
    //     viewport: docPage.getViewport(1),
    // })
}

export const pageBackground = {
    [pageType.BLANK]: blank,
    [pageType.CHECKERED]: checkered,
    [pageType.RULED]: ruled,
    [pageType.DOC]: doc,
}
