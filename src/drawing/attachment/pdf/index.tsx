/* eslint-disable @typescript-eslint/no-var-requires */
import { MAX_PIXEL_SCALE } from "consts"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"
import { PageViewport } from "pdfjs-dist"
import {
    PDFDocumentProxy,
    RenderParameters,
} from "pdfjs-dist/types/src/display/api"
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
    cachedBlob: Uint8Array
    renderedData: RenderedData
    pdf?: PDFDocumentProxy

    constructor(dataBlob?: Uint8Array) {
        this.id = nanoid(16)
        this.type = AttachType.PDF
        this.renderedData = {}
        this.cachedBlob = dataBlob ?? new Uint8Array()
    }

    setId(attachId: AttachId): PDFAttachment {
        this.id = attachId
        return this
    }

    async load(): Promise<PDFAttachment> {
        this.pdf = await pdfjs.getDocument(this.cachedBlob).promise
        return this
    }

    async getNumDocumentPages(): Promise<number> {
        if (!this.pdf) {
            await this.load()
        }
        // eslint-disable-next-line no-underscore-dangle
        return this.pdf?._pdfInfo.numPages
    }

    async getPageDimension(
        documentPageNum: number
    ): Promise<PageViewport | undefined> {
        if (!this.pdf) {
            await this.load()
        }

        const page = await this.pdf?.getPage(documentPageNum)
        const viewport = page?.getViewport({ scale: MAX_PIXEL_SCALE })
        return viewport
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
        if (!this.pdf) {
            await this.load()
        }
        this.renderedData = {}

        // process all pages by drawing them in
        // a canvas and saving the image data
        // eslint-disable-next-line no-underscore-dangle
        for (let i = 0; i < this.pdf?._pdfInfo.numPages; i += 1) {
            this.renderDocumentPage(i + 1)
        }

        return this
    }

    async renderDocumentPage(
        documentPageNum: number
    ): Promise<ImageData | undefined> {
        if (this.renderedData[documentPageNum]) {
            return this.renderedData[documentPageNum]
        }

        if (!this.pdf) {
            await this.load()
        }

        const canvas = document.createElement("canvas")
        const canvasContext = canvas.getContext(
            "2d"
        ) as CanvasRenderingContext2D

        const page = await this.pdf?.getPage(documentPageNum)
        const viewport = await this.getPageDimension(documentPageNum)

        if (!viewport?.height || !viewport.width) {
            return undefined
        }

        canvas.height = Math.floor(viewport?.height)
        canvas.width = Math.floor(viewport?.width)

        await page?.render({
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

        this.renderedData[documentPageNum] = imageData

        canvas.width = 1
        canvas.height = 1
        canvasContext.clearRect(0, 0, 1, 1)
        canvas.remove()

        return this.renderedData[documentPageNum]
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
        // await this.render()
        return this
    }
}
