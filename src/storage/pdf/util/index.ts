import { PDFDocument, PDFImage, PDFPage } from "pdf-lib"
import { MAX_PIXEL_SCALE, PAGE_SIZE } from "consts"
import { readFileAsUint8Array } from "storage/util"
import { BoardPage } from "drawing/page"
import { PDFAttachment } from "drawing/attachment"
import { view } from "state/view"
import { board } from "state/board"
import { online } from "state/online"
import { action } from "state/action"
import { request } from "api/request"
import { AttachId, PageMeta, Paper } from "state/board/state/index.types"
import { pageToDataURL } from "./rendering"

export const importPdfFile = async (file: File): Promise<void> => {
    const blob = await readFileAsUint8Array(file)
    const pdf = await new PDFAttachment(blob).load()

    if (online.isConnected()) {
        const { attachId } = await request.postAttachment(file)
        pdf.setId(attachId)
    }

    board.addAttachments([pdf])
    await addRenderedPdf(pdf)
}

const addRenderedPdf = async (attachment: PDFAttachment): Promise<void> => {
    action.deleteAllPages()
    const numDocumentPages = await attachment.getNumDocumentPages()

    const pagePromises = new Array(numDocumentPages)
        .fill(0)
        .map(async (_, i) => {
            const viewport = await attachment.getPageDimension(i + 1)
            return new BoardPage().updateMeta({
                background: {
                    paper: Paper.Doc,
                    attachId: attachment.id,
                    documentPageNum: i + 1,
                },
                size: {
                    width:
                        (viewport?.width ?? PAGE_SIZE.A4_PORTRAIT.width) /
                        MAX_PIXEL_SCALE,
                    height:
                        (viewport?.height ?? PAGE_SIZE.A4_PORTRAIT.height) /
                        MAX_PIXEL_SCALE,
                },
            })
        })

    const pages = await Promise.all(pagePromises)

    if (online.isConnected()) {
        online.addPages(
            pages,
            pages.map(() => -1)
        )
    } else {
        const addPageData = pages.map((page) => {
            return {
                page,
                index: -1,
            }
        })

        board.addPages(addPageData)
        view.resetView()
    }

    view.jumpToFirstPage()
    // clear the stacks when importing pdfs
    action.clearUndoRedo()
}

export const ENCRYPTED_PDF_ERROR = "Encrypted PDF"

export const renderAsPdf = async (): Promise<Uint8Array> => {
    const { pageRank, pageCollection } = board.getState()
    const pdfDocuments: Record<AttachId, PDFPage[]> = {}
    const pdf = await PDFDocument.create()

    const pageImages = await Promise.all(
        pageRank.map(async (pageId) => {
            const page = pageCollection[pageId]
            const data = await pageToDataURL(page)
            if (data && data.length !== 0) {
                return pdf.embedPng(data)
            }
            return null
        })
    )

    // return the correct background pdf page if any
    const getBasePage = async (
        meta: PageMeta
    ): Promise<PDFPage | undefined> => {
        let basePage: PDFPage | undefined
        const { paper, attachId, documentPageNum } = meta.background
        if (
            paper === Paper.Doc &&
            documentPageNum !== undefined &&
            attachId !== undefined
        ) {
            if (!pdfDocuments[attachId]) {
                // if document is not loaded yet (loaded by pdf-lib)
                const attachment = board.getState().attachments[attachId]

                try {
                    const src = await PDFDocument.load(attachment.cachedBlob, {
                        ignoreEncryption: false,
                    })
                    pdfDocuments[attachId] = await pdf.copyPages(src, [
                        ...Array(src.getPages().length).keys(),
                    ])
                } catch (error) {
                    throw new Error(ENCRYPTED_PDF_ERROR)
                }
            }
            basePage = pdfDocuments[attachId][documentPageNum]
        }
        return basePage
    }

    for (let i = 0; i < pageImages.length; i++) {
        const currentPage = pageCollection[pageRank[i]]

        if (currentPage) {
            const pageSize = currentPage.meta.size
            const basePage = await getBasePage(currentPage.meta)

            const page = pdf.addPage(basePage)
            page.setSize(pageSize.width, pageSize.height)
            if (pageImages[i]) {
                page.drawImage(pageImages[i] as PDFImage, {
                    x: 0,
                    y: 0,
                    width: pageSize.width,
                    height: pageSize.height,
                })
            }
        }
    }

    const pdfBytes = await pdf.save()

    return pdfBytes
}
