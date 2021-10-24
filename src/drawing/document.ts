/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-unresolved
import { DOC_SCALE } from "consts"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"
// import pdfjsWorker from "pdfjs-dist/es5/build/pdf.worker.entry"
import { RenderParameters } from "pdfjs-dist/types/display/api"

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
 * | `URL`         | URL of the document's origin  |
 * | `Uint8Array`  | The raw bytes of a PDF        |
 *
 * @param fileData
 */
export async function PDFtoImageData(
    fileSrc: URL | string | Uint8Array
): Promise<string[]> {
    // also support strings as URL
    if (typeof fileSrc === typeof "") {
        fileSrc = new URL(fileSrc as string)
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
        const imgSrc = canvas.toDataURL("image/png")
        canvas.remove()

        return imgSrc
    })

    // documentImages
    return Promise.all(pages)
}
