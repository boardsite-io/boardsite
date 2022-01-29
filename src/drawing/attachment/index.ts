import { currentSession, isConnected } from "api/session"
import { backgroundStyle, FILE_EXTENSION_WORKSPACE, PIXEL_RATIO } from "consts"
import { handleDeleteAllPages } from "drawing/handlers"
import { readFileAsUint8Array } from "drawing/io/helpers"
import { BoardPage } from "drawing/page"
import { IntlMessageId } from "language"
import {
    ADD_ATTACHMENTS,
    ADD_PAGES,
    CLEAR_UNDO_REDO,
    JUMP_TO_FIRST_PAGE,
    LOAD_BOARD_STATE,
} from "redux/board"
import { Attachment, BoardState, PageSize } from "redux/board/index.types"
import store from "redux/store"
import { handleImportWorkspaceFile } from "redux/workspace"
import { PDFAttachment } from "./pdf"

export const handleProcessFileImport = async (
    file: File
): Promise<IntlMessageId | undefined> => {
    if (file.type === "application/pdf") {
        await importPdfFile(file)
        return undefined
    }

    if (file.name.endsWith(FILE_EXTENSION_WORKSPACE)) {
        if (isConnected()) {
            return "ImportMenu.Error.NoWorkspaceInSession"
        }
        const partialRootState = await handleImportWorkspaceFile(file)
        if (partialRootState.board) {
            store.dispatch(
                LOAD_BOARD_STATE(partialRootState.board as BoardState)
            )
            return undefined
        }

        return "ImportMenu.Error.NoBoardStateFound"
    }

    return "ImportMenu.Error.InvalidFileType"
}

const importPdfFile = async (file: File): Promise<void> => {
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

const getPageSize = (dataURL: string): PageSize => {
    const header = atob(dataURL.split(",")[1].slice(0, 50)).slice(16, 24)
    const uint8 = Uint8Array.from(header, (c) => c.charCodeAt(0))
    const dataView = new DataView(uint8.buffer)

    return {
        width: dataView.getInt32(0) / PIXEL_RATIO,
        height: dataView.getInt32(4) / PIXEL_RATIO,
    }
}
