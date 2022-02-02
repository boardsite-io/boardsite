import { PDFDocument, PDFImage, PDFPage } from "pdf-lib"
import store from "redux/store"
import { backgroundStyle } from "consts"
import { currentSession, isConnected } from "api/session"
import { handleDeleteAllPages } from "drawing/handlers"
import { readFileAsUint8Array } from "drawing/fileManagement/helpers"
import { BoardPage } from "drawing/page"
import {
    ADD_ATTACHMENTS,
    ADD_PAGES,
    CLEAR_UNDO_REDO,
    JUMP_TO_FIRST_PAGE,
} from "redux/board"
import { AttachId, Attachment, PageMeta } from "redux/board/index.types"
import { PDFAttachment } from "drawing/attachment"
import { pageToDataURL } from "./rendering"
import { getPageSize } from "./helpers"

export const handleImportPdfFile = async (file: File): Promise<void> => {
    const blob = await readFileAsUint8Array(file)
    const pdf = await new PDFAttachment(blob).render()

    if (isConnected()) {
        const attachId = await currentSession().addAttachment(file)
        pdf.setId(attachId)
    }

    store.dispatch(ADD_ATTACHMENTS([pdf]))
    await addRenderedPdf(pdf)
}

const addRenderedPdf = async (attachment: Attachment): Promise<void> => {
    handleDeleteAllPages()

    if (isConnected()) {
        const pages = attachment.renderedData.map((img, i) =>
            new BoardPage().updateMeta({
                background: {
                    style: backgroundStyle.DOC,
                    attachId: attachment.id,
                    documentPageNum: i,
                },
                size: getPageSize(img),
            })
        )

        currentSession().addPages(
            pages,
            pages.map(() => -1)
        )
    } else {
        const addPageData = attachment.renderedData.map((img, i) => ({
            page: new BoardPage().updateMeta({
                background: {
                    style: backgroundStyle.DOC,
                    attachId: attachment.id,
                    documentPageNum: i,
                },
                size: getPageSize(img),
            }),
            index: -1, // append subsequent pages at the end
        }))

        store.dispatch(ADD_PAGES({ data: addPageData }))
    }

    store.dispatch(JUMP_TO_FIRST_PAGE())
    // clear the stacks when importing pdfs
    store.dispatch(CLEAR_UNDO_REDO())
}

export const renderAsPdf = async (): Promise<Uint8Array> => {
    const { pageRank, pageCollection } = store.getState().board
    const pdfDocuments: Record<AttachId, PDFPage[]> = {}
    const pdf = await PDFDocument.create()

    const pageImages = await Promise.all(
        pageRank.map(async (pageId) => {
            const data = await pageToDataURL(pageId, true)
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
            attachId
        ) {
            if (!pdfDocuments[attachId]) {
                // if document is not loaded yet (loaded by pdf-lib)
                const attachment = store.getState().board.attachments[attachId]
                const src = await PDFDocument.load(attachment.cachedBlob)
                pdfDocuments[attachId] = await pdf.copyPages(src, [
                    ...Array(src.getPages().length).keys(),
                ])
            }
            basePage = pdfDocuments[attachId][documentPageNum]
        }
        return basePage
    }

    for (let i = 0; i < pageImages.length; i++) {
        const { meta } = pageCollection[pageRank[i]]
        const { size } = meta
        const basePage = await getBasePage(meta)

        const page = pdf.addPage(basePage)
        page.setSize(size.width, size.height)
        if (pageImages[i]) {
            page.drawImage(pageImages[i] as PDFImage, {
                x: 0,
                y: 0,
                width: size.width,
                height: size.height,
            })
        }
    }

    const pdfBytes = await pdf.save()

    return pdfBytes
}
