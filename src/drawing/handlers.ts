import { Stroke } from "drawing/stroke/types"
import {
    JUMP_TO_NEXT_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    SET_PAGEMETA,
    SET_PAGE_BACKGROUND,
    INITIAL_VIEW,
} from "redux/board/board"
import {
    addPagesSession,
    updatePagesSession,
    deletePagesSession,
    isConnected,
    addAttachmentSession,
    getAttachmentSession,
} from "../api/websocket"
import { pageType } from "../constants"
import store from "../redux/store"
import { PageBackground } from "../types"
import { toPDF } from "./io"
import { BoardPage, getPDFfromForm, loadNewPDF } from "./page"
import {
    addStrokes,
    deleteStrokes,
    redo,
    undo,
    updateStrokes,
} from "./undoredo"

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

export function handleDeletePage(): void {
    if (isConnected()) {
        deletePagesSession([getCurrentPageId()])
    } else {
        store.dispatch(DELETE_PAGE(getCurrentPageId()))
    }
}

export function handleDeleteAllPages(): void {
    if (isConnected()) {
        deletePagesSession(store.getState().board.pageRank)
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

export function handlePageBackground(style: PageBackground): void {
    // update the default page type
    store.dispatch(SET_PAGE_BACKGROUND(style))
    const currentPage = getCurrentPage()
    // cannot update background of doc type
    if (currentPage.meta.background.style === pageType.DOC) {
        return
    }

    const newMeta = { ...currentPage.meta }
    newMeta.background.style = style

    if (isConnected()) {
        updatePagesSession([currentPage.updateMeta(newMeta)])
    } else {
        store.dispatch(SET_PAGEMETA({ pageId: currentPage.pageId, newMeta }))
    }
}

export async function handleDocument(file: File): Promise<void> {
    if (isConnected()) {
        const attachId = await addAttachmentSession(file)
        await loadNewPDF(attachId)
        handleAddDocumentPages(attachId)
    } else {
        const fileSrc = await getPDFfromForm(file)
        await loadNewPDF(fileSrc)
        handleAddDocumentPages()
    }
}

export function handleAddDocumentPages(attachId?: string): void {
    const documentPages = store.getState().board.document

    handleDeleteAllPages()

    const pages = documentPages.map(
        (_, i) => new BoardPage(pageType.DOC, i, attachId)
    )
    if (isConnected()) {
        addPagesSession(
            pages,
            pages.map(() => -1)
        )
    } else {
        pages.forEach((page) => page.add(-1)) // append subsequent pages at the end
    }
}

export async function handleExportDocument(): Promise<void> {
    // TODO filename
    const filename = "board.pdf"
    const { documentSrc } = store.getState().board
    if (isConnected()) {
        const src = documentSrc
            ? ((await getAttachmentSession(documentSrc as string)) as string)
            : ""
        toPDF(filename, src)
    } else {
        toPDF(filename, documentSrc)
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
