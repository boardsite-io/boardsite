/* eslint-disable @typescript-eslint/no-var-requires */
import { MAX_PIXEL_SCALE } from "consts"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"
import { RenderParameters } from "pdfjs-dist/types/src/display/api"
import { nanoid } from "nanoid"
import {
    AttachId,
    Attachment,
    AttachType,
    RenderedData,
    SerializedAttachment,
} from "state/board/state/index.types"
import { assign, pick } from "lodash"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfjsWorker: any = require("pdfjs-dist/legacy/build/pdf.worker.entry")

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export class PDFAttachment implements Attachment {
    id: AttachId
    type: AttachType
    renderedData: RenderedData
    cachedBlob: Uint8Array

    constructor(dataBlob?: Uint8Array) {
        this.id = nanoid(16)
        this.type = AttachType.PDF
        this.renderedData = []
        this.cachedBlob = dataBlob ?? new Uint8Array()
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
                const viewport = page.getViewport({ scale: MAX_PIXEL_SCALE })

                const canvas = document.createElement("canvas")
                const canvasContext = canvas.getContext(
                    "2d"
                ) as CanvasRenderingContext2D

                canvas.height = viewport.height
                canvas.width = viewport.width

                await page.render({
                    canvasContext,
                    viewport,
                    enableWebGL: true,
                } as RenderParameters).promise

                const imageData = canvasContext.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                )
                canvas.remove()

                return imageData
            })

        this.renderedData = await Promise.all(pages)
        return this
    }

    serialize(): SerializedAttachment {
        return {
            id: this.id,
            type: this.type,
            cachedBlob: this.cachedBlob,
        }
    }

    async deserialize(serialized: SerializedAttachment): Promise<Attachment> {
        assign(this, pick(serialized, ["id", "type", "cachedBlob"]))
        await this.render()
        return this
    }
}
