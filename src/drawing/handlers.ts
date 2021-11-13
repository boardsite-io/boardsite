import { cloneDeep } from "lodash"
import { Stroke, Tool } from "drawing/stroke/types"
import {
    JUMP_TO_NEXT_PAGE,
    CLEAR_PAGE,
    DELETE_PAGES,
    DELETE_ALL_PAGES,
    SET_PAGEMETA,
    INITIAL_VIEW,
    SET_PDF,
    ADD_PAGE,
    ADD_STROKES,
    UPDATE_STROKES,
    ERASE_STROKES,
    UNDO_ACTION,
    REDO_ACTION,
    CLEAR_TRANSFORM,
} from "redux/board/board"
import {
    addPagesSession,
    updatePagesSession,
    deletePagesSession,
    isConnected,
    addAttachmentSession,
    getAttachmentSession,
    sendStrokes,
    eraseStrokes,
    getUserId,
    getSocket,
} from "api/websocket"
import { pageType, PIXEL_RATIO } from "consts"
import { StrokeAction } from "redux/board/state"
import store from "redux/store"
import { PageMeta } from "types"
import { SET_TOOL } from "redux/drawing/drawing"
import { toPDF } from "./io"
import { BoardPage } from "./page"
import { getPDFfromForm, PDFtoImageData } from "./document"

export function handleSetTool(tool: Partial<Tool>): void {
    store.dispatch(SET_TOOL(tool))
    store.dispatch(CLEAR_TRANSFORM())
}

export function handleAddPageOver(): void {
    const page = new BoardPage()
    const index = store.getState().board.currentPageIndex
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        store.dispatch(ADD_PAGE({ page, index }))
    }
    store.dispatch(INITIAL_VIEW())
}

export function handleAddPageUnder(): void {
    const page = new BoardPage()
    const index = store.getState().board.currentPageIndex + 1
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        store.dispatch(ADD_PAGE({ page, index }))
    }
    store.dispatch(JUMP_TO_NEXT_PAGE())
    store.dispatch(INITIAL_VIEW())
}

export function handleClearPage(): void {
    if (isConnected()) {
        updatePagesSession(true, getCurrentPage())
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

export function handleAddStrokes(...strokes: Stroke[]): void {
    const payload: StrokeAction = {
        strokes,
        isRedoable: true,
    }

    if (isConnected()) {
        const ws = getSocket()
        const userId = getUserId()
        payload.sessionHandler = () => sendStrokes(ws, userId, ...strokes)
        payload.sessionUndoHandler = () => eraseStrokes(ws, userId, ...strokes)
    }

    store.dispatch(ADD_STROKES(payload))
}

export function handleDeleteStrokes(...strokes: Stroke[]): void {
    const payload: StrokeAction = {
        strokes,
        isRedoable: true,
    }

    if (isConnected()) {
        const ws = getSocket()
        const userId = getUserId()
        payload.sessionHandler = () => eraseStrokes(ws, userId, ...strokes)
        payload.sessionUndoHandler = () => sendStrokes(ws, userId, ...strokes)
    }

    store.dispatch(ERASE_STROKES(payload))
}

export function handleUpdateStrokes(...strokes: Stroke[]): void {
    const payload: StrokeAction = {
        strokes,
        isRedoable: true,
    }

    if (isConnected()) {
        const ws = getSocket()
        const userId = getUserId()
        payload.sessionHandler = (...updates: Stroke[]) =>
            sendStrokes(ws, userId, ...updates)
        payload.sessionUndoHandler = (...updates: Stroke[]) =>
            sendStrokes(ws, userId, ...updates)
    }

    store.dispatch(UPDATE_STROKES(payload))
}

export function handleUndo(): void {
    store.dispatch(UNDO_ACTION())
}

export function handleRedo(): void {
    store.dispatch(REDO_ACTION())
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

    const newMeta = cloneDeep<PageMeta>(currentPage.meta)
    newMeta.background.style = background

    if (isConnected()) {
        updatePagesSession(false, currentPage.updateMeta(newMeta))
    } else {
        store.dispatch(
            SET_PAGEMETA({ pageId: currentPage.pageId, meta: newMeta })
        )
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
        const pages = documentImages.map((img, i) => {
            const { pageWidth, pageHeight } = getPageDimensions(img)
            return new BoardPage().updateMeta({
                background: {
                    style: pageType.DOC,
                    attachURL: fileOriginSrc as URL,
                    documentPageNum: i,
                },
                width: pageWidth / PIXEL_RATIO,
                height: pageHeight / PIXEL_RATIO,
            })
        })
        addPagesSession(
            pages,
            pages.map(() => -1)
        )
    } else {
        const pages = documentImages.map((_, i) =>
            new BoardPage().updateMeta({
                background: { style: pageType.DOC, documentPageNum: i },
            } as PageMeta)
        )
        pages.forEach((page) => {
            store.dispatch(ADD_PAGE({ page, index: -1 }))
        }) // append subsequent pages at the end
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

function getPageDimensions(dataURL: string) {
    const header = atob(dataURL.split(",")[1].slice(0, 50)).slice(16, 24)
    const uint8 = Uint8Array.from(header, (c) => c.charCodeAt(0))
    const dataView = new DataView(uint8.buffer)

    return {
        pageWidth: dataView.getInt32(0),
        pageHeight: dataView.getInt32(4),
    }
}
