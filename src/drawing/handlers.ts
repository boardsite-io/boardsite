import { Stroke } from "board/stroke/types"
import {
    addPagesSession,
    updatePagesSession,
    deletePagesSession,
    isConnected,
    addAttachmentSession,
    getAttachmentSession,
} from "../api/websocket"
import { pageType } from "../constants"
import {
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    SET_PAGEBG,
    SET_PAGEMETA,
} from "../redux/slice/boardcontrol"

import store from "../redux/store"
import { PageBackground, PageMeta } from "../types"
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
    const index = store.getState().viewControl.currentPageIndex
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        page.add(index)
    }
}

export function handleAddPageUnder(): void {
    const page = new BoardPage()
    const index = store.getState().viewControl.currentPageIndex + 1
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        page.add(index)
    }
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
        deletePagesSession(store.getState().boardControl.pageRank)
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

export function handleDeleteStroke(stroke: Stroke): void {
    deleteStrokes([stroke])
}

export function handleUndo(): void {
    undo()
}

export function handleRedo(): void {
    redo()
}

export function handlePageBackground(style: PageBackground): void {
    // update the default page type
    store.dispatch(SET_PAGEBG(style))

    // cannot update background of doc type
    if (getCurrentPage().meta.background.style === pageType.DOC) {
        return
    }

    const meta: PageMeta = {
        background: { ...getCurrentPage().meta.background, style },
    }

    if (isConnected()) {
        updatePagesSession([getCurrentPage().updateMeta(meta)])
    } else {
        store.dispatch(SET_PAGEMETA({ pageId: getCurrentPage().pageId, meta }))
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
    const documentPages = store.getState().boardControl.document

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
    const { documentSrc } = store.getState().boardControl
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
    return store.getState().boardControl.pageRank[
        store.getState().viewControl.currentPageIndex
    ]
}

function getCurrentPage() {
    return store.getState().boardControl.pageCollection[
        store.getState().boardControl.pageRank[
            store.getState().viewControl.currentPageIndex
        ]
    ]
}
