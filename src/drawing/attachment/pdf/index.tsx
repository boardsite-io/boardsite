/* eslint-disable @typescript-eslint/no-var-requires */
import { DOC_SCALE } from "consts"
import {
    AttachId,
    Attachment,
    AttachType,
    DocumentImages,
} from "redux/board/index.types"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"
import { RenderParameters } from "pdfjs-dist/types/src/display/api"
import { nanoid } from "@reduxjs/toolkit"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfjsWorker: any = require("pdfjs-dist/legacy/build/pdf.worker.entry")

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export class PDFAttachment implements Attachment {
    id: AttachId
    type: AttachType
    renderedData: DocumentImages
    cachedBlob: Uint8Array

    constructor(dataBlob: Uint8Array) {
        this.id = nanoid(16)
        this.type = AttachType.PDF
        this.renderedData = []
        this.cachedBlob = dataBlob
    }

    setId(attachId: AttachId): PDFAttachment {
        this.id = attachId
        return this
    }

    /**
     * Loads a pdf document from data/url and converts it to image data
     *
     * | Type          | Contents                      |
     * | ------------- | ----------------------------- |
     * | `Uint8Array`  | The raw bytes of a PDF        |
     *
     */
    async render(): Promise<PDFAttachment> {
        const pdf = await pdfjs.getDocument(this.cachedBlob).promise

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

        this.renderedData = await Promise.all(pages)
        return this
    }

    serialize(): void {
        this.renderedData = []
    }

    deserialize(): Promise<PDFAttachment> {
        return this.render()
    }
}
