/* eslint-disable @typescript-eslint/no-var-requires */
import { DOC_SCALE } from "consts"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"
// import pdfjsWorker from "pdfjs-dist/es5/build/pdf.worker.entry"
import { RenderParameters } from "pdfjs-dist/types/src/display/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfjsWorker: any = require("pdfjs-dist/legacy/build/pdf.worker.entry")

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export const getPDFfromForm = async (file: File): Promise<Uint8Array> =>
    new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
            resolve(new Uint8Array(fileReader.result as ArrayBuffer))
        }
        fileReader.onerror = (err) => {
            reject(err)
        }
        fileReader.readAsArrayBuffer(file)
    })

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
    if (typeof fileSrc === "string") {
        fileSrc = new URL(fileSrc as string)
    }

    const pdf = await pdfjs.getDocument(fileSrc).promise

    // process all pages by drawing them in
    // a canvas and saving the image data
    // eslint-disable-next-line no-underscore-dangle
    const pages = new Array(pdf._pdfInfo.numPages)
        .fill(null)
        .map(async (_, i) => {
            const page = await pdf.getPage(i + 1)
            const viewport = page.getViewport({ scale: DOC_SCALE })

            const canvas = document.createElement("canvas")
            const canvasContext = canvas.getContext("2d")

            canvas.height = viewport.height
            canvas.width = viewport.width

            await page.render({
                canvasContext,
                viewport,
                enableWebGL: true,
            } as RenderParameters).promise

            const imgSrc = canvas.toDataURL("image/png")
            canvas.remove()

            return imgSrc
        })

    return Promise.all(pages)
}
