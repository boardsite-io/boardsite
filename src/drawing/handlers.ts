import { Stroke } from "drawing/stroke/types"
import {
    JUMP_TO_NEXT_PAGE,
    CLEAR_PAGE,
    DELETE_PAGES,
    DELETE_ALL_PAGES,
    SET_PAGEMETA,
    INITIAL_VIEW,
    SET_PDF,
} from "redux/board/board"
import {
    addPagesSession,
    updatePagesSession,
    deletePagesSession,
    isConnected,
    addAttachmentSession,
    getAttachmentSession,
} from "api/websocket"
import { pageType } from "consts"
import store from "redux/store"
import { toPDF } from "./io"
import { BoardPage } from "./page"
import {
    addStrokes,
    deleteStrokes,
    redo,
    undo,
    updateStrokes,
} from "./undoredo"
import { getPDFfromForm, PDFtoImageData } from "./document"

export function handleAddPageOver(): void {
    const page = new BoardPage()
    const index = store.getState().board.currentPageIndex
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        page.add(index)
    }
    store.dispatch(INITIAL_VIEW())
}

export function handleAddPageUnder(): void {
    const page = new BoardPage()
    const index = store.getState().board.currentPageIndex + 1
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        page.add(index)
    }
    store.dispatch(JUMP_TO_NEXT_PAGE())
    store.dispatch(INITIAL_VIEW())
}

export function handleClearPage(): void {
    if (isConnected()) {
        updatePagesSession([getCurrentPage()], true)
    } else {
        store.dispatch(CLEAR_PAGE(getCurrentPageId()))
    }
}

export function handleDeleteCurrentPage(): void {
    handleDeletePages(...getCurrentPageId())
}

export function handleDeletePages(...pageIds: string[]): void {
    if (isConnected()) {
        deletePagesSession(...pageIds)
    } else {
        store.dispatch(DELETE_PAGES([getCurrentPageId()]))
    }
}

export function handleDeleteAllPages(): void {
    if (isConnected()) {
        deletePagesSession(...store.getState().board.pageRank)
    } else {
        store.dispatch(DELETE_ALL_PAGES())
    }
}

export function handleAddStroke(stroke: Stroke): void {
    addStrokes([stroke])
}

export function handleUpdateStrokes(strokes: Stroke[]): void {
    updateStrokes(strokes)
}

export function handleDeleteStrokes(strokes: Stroke[]): void {
    deleteStrokes(strokes)
}

export function handleUndo(): void {
    undo()
}

export function handleRedo(): void {
    redo()
}

export function handleChangePageBackground(): void {
    // update the default page type
    const currentPage = getCurrentPage()
    const { background } = store.getState().board.pageSettings
    // there is no current page, eg. when all pages have been removed
    if (!currentPage) {
        return
    }
    // cannot update background of doc type
    if (currentPage.meta.background.style === pageType.DOC) {
        return
    }

    const newMeta = { ...currentPage.meta }
    newMeta.background.style = background

    if (isConnected()) {
        updatePagesSession([currentPage.updateMeta(newMeta)])
    } else {
        store.dispatch(SET_PAGEMETA({ pageId: currentPage.pageId, newMeta }))
    }
}

export async function handleGetDocumentFile(
    file: File
): Promise<URL | Uint8Array> {
    return isConnected() ? addAttachmentSession(file) : getPDFfromForm(file)
}

export async function handleLoadDocument(
    fileOriginSrc: URL | string | Uint8Array
): Promise<void> {
    const documentImages = await PDFtoImageData(fileOriginSrc)
    store.dispatch(
        SET_PDF({
            documentImages,
            documentSrc: fileOriginSrc,
        })
    )
}

export function handleAddDocumentPages(fileOriginSrc: URL | Uint8Array): void {
    const { documentImages } = store.getState().board

    handleDeleteAllPages()

    if (isConnected()) {
        const pages = documentImages.map(
            (_, i) => new BoardPage(pageType.DOC, i, fileOriginSrc as URL)
        )
        addPagesSession(
            pages,
            pages.map(() => -1)
        )
    } else {
        const pages = documentImages.map(
            (_, i) => new BoardPage(pageType.DOC, i)
        )
        pages.forEach((page) => page.add(-1)) // append subsequent pages at the end
    }
}

export async function handleExportDocument(): Promise<void> {
    // TODO filename
    const filename = "board.pdf"
    const { documentSrc } = store.getState().board
    if (isConnected()) {
        const [src] = await getAttachmentSession(documentSrc as string)
        toPDF(filename, src as Uint8Array)
    } else {
        toPDF(filename, documentSrc as Uint8Array)
    }
}

function getCurrentPageId() {
    return store.getState().board.pageRank[
        store.getState().board.currentPageIndex
    ]
}

function getCurrentPage() {
    return store.getState().board.pageCollection[
        store.getState().board.pageRank[store.getState().board.currentPageIndex]
    ]
}
