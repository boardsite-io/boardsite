import { currentSession, isConnected } from "api/session"
import { backgroundStyle, FILE_EXTENSION_WORKSPACE, PIXEL_RATIO } from "consts"
import { handleDeleteAllPages } from "drawing/handlers"
import { readFileAsUint8Array } from "drawing/io"
import { BoardPage } from "drawing/page"
import {
    ADD_ATTACHMENTS,
    ADD_PAGES,
    CLEAR_UNDO_REDO,
    JUMP_TO_FIRST_PAGE,
    LOAD_BOARD_STATE,
} from "redux/board/board"
import { Attachment, BoardState, PageSize } from "redux/board/board.types"
import store from "redux/store"
import { handleImportWorkspaceFile } from "redux/workspace"
import { PDFAttachment } from "./pdf"

export const handleProcessFileImport = async (file: File) => {
    if (file.type === "application/pdf") {
        await importPdfFile(file)
        return
    }

    if (file.name.endsWith(FILE_EXTENSION_WORKSPACE)) {
        if (isConnected()) {
            throw new Error(
                "importing workspaces in online session is not available yet"
            )
        }
        const partialRootState = await handleImportWorkspaceFile(file)
        if (partialRootState.board) {
            store.dispatch(
                LOAD_BOARD_STATE(partialRootState.board as BoardState)
            )
            return
        }

        throw new Error("no board state found in file")
    }

    throw new Error("invalid file type")
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

        pages.forEach((page) => {
            store.dispatch(ADD_PAGES({ data: [{ page, index: -1 }] }))
        }) // append subsequent pages at the end
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
