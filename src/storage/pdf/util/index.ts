import { PDFDocument, PDFImage, PDFPage } from "pdf-lib"
import { backgroundStyle, MAX_PIXEL_SCALE } from "consts"
import { handleDeleteAllPages } from "drawing/handlers"
import { readFileAsUint8Array } from "storage/util"
import { BoardPage } from "drawing/page"
import { PDFAttachment } from "drawing/attachment"
import { view } from "state/view"
import { board } from "state/board"
import { online } from "state/online"
import { AttachId, Attachment, PageMeta } from "state/board/state/index.types"
import { pageToDataURL } from "./rendering"

export const importPdfFile = async (file: File): Promise<void> => {
    const blob = await readFileAsUint8Array(file)
    const pdf = await new PDFAttachment(blob).render()

    if (online.state.session?.isConnected()) {
        const attachId = await online.state.session?.addAttachment(file)
        pdf.setId(attachId)
    }

    board.addAttachments([pdf])
    await addRenderedPdf(pdf)
}

const addRenderedPdf = async (attachment: Attachment): Promise<void> => {
    handleDeleteAllPages()

    if (online.state.session?.isConnected()) {
        const pages = attachment.renderedData.map((img, i) => {
            return new BoardPage().updateMeta({
                background: {
                    style: backgroundStyle.DOC,
                    attachId: attachment.id,
                    documentPageNum: i,
                },
                size: {
                    width: img.width / MAX_PIXEL_SCALE,
                    height: img.height / MAX_PIXEL_SCALE,
                },
            })
        })

        online.state.session?.addPages(
            pages,
            pages.map(() => -1)
        )
    } else {
        const addPageData = attachment.renderedData.map((img, i) => {
            return {
                page: new BoardPage().updateMeta({
                    background: {
                        style: backgroundStyle.DOC,
                        attachId: attachment.id,
                        documentPageNum: i,
                    },
                    size: {
                        width: img.width / MAX_PIXEL_SCALE,
                        height: img.height / MAX_PIXEL_SCALE,
                    },
                }),
                index: -1, // append subsequent pages at the end
            }
        })

        board.handleAddPages({ data: addPageData })
        view.resetView()
    }

    board.jumpToFirstPage()
    // clear the stacks when importing pdfs
    board.clearUndoRedo()
}

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
        const { style, attachId, documentPageNum } = meta.background
        if (
            style === backgroundStyle.DOC &&
            documentPageNum !== undefined &&
            attachId !== undefined
        ) {
            if (!pdfDocuments[attachId]) {
                // if document is not loaded yet (loaded by pdf-lib)
                const attachment = board.getState().attachments[attachId]
                const src = await PDFDocument.load(attachment.cachedBlob, {
                    ignoreEncryption: false, // TODO: Fix or handle encrypted PDF issue separately
                })
                pdfDocuments[attachId] = await pdf.copyPages(src, [
                    ...Array(src.getPages().length).keys(),
                ])
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
