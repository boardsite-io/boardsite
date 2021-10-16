import { Stroke } from "redux/drawing/drawing.types"
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
import { createPage, getPDFfromForm, loadNewPDF } from "redux/board/util/page"
import { Page, PageVariants } from "redux/board/board.types"
import { toPDF } from "../../board/util/io"
import {
    addStrokes,
    deleteStrokes,
    redo,
    undo,
    updateStrokes,
} from "./undoredo"

export function handleAddPageOver(): void {
    const page = createPage({})
    const index = store.getState().board.currentPageIndex

    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        store.dispatch({ type: "ADD_PAGE", payload: { page, index } })
    }
    store.dispatch({
        type: "INITIAL_VIEW",
        payload: undefined,
    })
}

export function handleAddPageUnder(): void {
    const page = createPage({})
    const index = store.getState().board.currentPageIndex + 1
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        store.dispatch({ type: "ADD_PAGE", payload: { page, index } })
    }
    store.dispatch({
        type: "JUMP_TO_NEXT_PAGE",
        payload: undefined,
    })
    store.dispatch({
        type: "INITIAL_VIEW",
        payload: undefined,
    })
}

export function handleClearPage(): void {
    if (isConnected()) {
        updatePagesSession([getCurrentPage()], true)
    } else {
        store.dispatch({
            type: "CLEAR_PAGE",
            payload: getCurrentPageId(),
        })
    }
}

export function handleDeletePage(): void {
    if (isConnected()) {
        deletePagesSession([getCurrentPageId()])
    } else {
        store.dispatch({
            type: "DELETE_PAGE",
            payload: getCurrentPageId(),
        })
    }
}

export function handleDeleteAllPages(): void {
    if (isConnected()) {
        deletePagesSession(store.getState().board.pageRank)
    } else {
        store.dispatch({
            type: "DELETE_ALL_PAGES",
            payload: undefined,
        })
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

export function handlePageBackground(style: PageVariants): void {
    // update the default page type
    store.dispatch({
        type: "SET_PAGE_BACKGROUND",
        payload: style,
    })
    const currentPage = getCurrentPage()
    // there is no current page, eg. when all pages have been removed
    if (!currentPage) {
        return
    }
    // cannot update background of doc type
    if (currentPage.meta.background.style === pageType.DOC) {
        return
    }

    const newMeta = { ...currentPage.meta }
    newMeta.background.style = style

    store.dispatch({
        type: "SET_PAGEMETA",
        payload: { pageId: currentPage.pageId, newMeta },
    })
    if (isConnected()) {
        updatePagesSession([currentPage])
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

    const pages = documentPages.map((_, i: number) =>
        createPage({
            style: pageType.DOC,
            pageNum: i,
            attachId,
        })
    )
    if (isConnected()) {
        addPagesSession(
            pages,
            pages.map(() => -1)
        )
    } else {
        pages.forEach((page: Page) =>
            store.dispatch({ type: "ADD_PAGE", payload: { page, index: -1 } })
        ) // append subsequent pages at the end
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
