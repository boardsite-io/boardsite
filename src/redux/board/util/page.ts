import store from "redux/store"

/* eslint-disable @typescript-eslint/no-var-requires */
import { Shape, ShapeConfig } from "konva/types/Shape"
import { Context } from "konva/types/Context"
// eslint-disable-next-line import/no-unresolved
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"
// import pdfjsWorker from "pdfjs-dist/es5/build/pdf.worker.entry"
import { RenderParameters } from "pdfjs-dist/types/display/api"
import { DOC_SCALE, pageType } from "consts"
import { nanoid } from "nanoid"
import { Page, PageVariants } from "../board.types"

interface createPageProps {
    id?: string
    style?: PageVariants
    pageNum?: number
    attachId?: string
}
export const createPage = ({
    id,
    style,
    pageNum,
    attachId,
}: createPageProps): Page => {
    const { width, height, background } = store.getState().board.pageSettings
    return {
        pageId: id ?? nanoid(8),
        meta: {
            background: {
                style: style ?? background,
                attachId: attachId ?? "",
                documentPageNum: pageNum ?? 0,
            },
            width,
            height,
        },
        strokes: {},
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfjsWorker: any = require("pdfjs-dist/legacy/build/pdf.worker.entry")

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

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

/**
 * Loads a pdf document from data/url and converts it to image data and cache it to redux
 *
 * | Type          | Contents                      |
 * | ------------- | ----------------------------- |
 * | `string`      | Attachment Id of the document |
 * | `Uint8Array`  | The raw bytes of a PDF        |
 *
 * @param fileData
 */
export async function loadNewPDF(fileData: Uint8Array | string): Promise<void> {
    let fileSrc: Uint8Array | URL
    if (typeof fileData === typeof "") {
        fileSrc = getAttachmentURL(fileData as string)
    } else {
        fileSrc = fileData as Uint8Array
    }

    const pdf = await pdfjs.getDocument(fileSrc).promise

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
    store.dispatch({
        type: "SET_PDF",
        payload: {
            pageImages: data,
            documentSrc: fileData,
        },
    })
}

function getAttachmentURL(attachId: string): URL {
    const { apiURL, sessionId } = store.getState().session
    return new URL(attachId, `${apiURL.toString()}b/${sessionId}/attachments/`)
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

interface PageBackground {
    [x: string]: (context: Context, shape: Shape<ShapeConfig>) => void
}
export const pageBackground: PageBackground = {
    [pageType.BLANK]: blank,
    [pageType.CHECKERED]: checkered,
    [pageType.RULED]: ruled,
}
