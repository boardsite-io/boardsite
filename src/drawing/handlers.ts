import React from "react"
import {
    addPageSession,
    updatePageSession,
    deletePageSession,
    isConnected,
    addAttachementSession,
    getAttachmentURL,
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
import { PageBackground, PageMeta, Stroke } from "../types"
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
        addPageSession(page, index)
    } else {
        page.add(index)
    }
}

export function handleAddPageUnder(): void {
    const page = new BoardPage()
    const index = store.getState().viewControl.currentPageIndex + 1
    if (isConnected()) {
        addPageSession(page, index)
    } else {
        page.add(index)
    }
}

export function handleClearPage(): void {
    if (isConnected()) {
        updatePageSession(getCurrentPageId(), undefined, true)
    } else {
        store.dispatch(CLEAR_PAGE(getCurrentPageId()))
    }
}

export function handleDeletePage(): void {
    if (isConnected()) {
        deletePageSession(getCurrentPageId())
    } else {
        store.dispatch(DELETE_PAGE(getCurrentPageId()))
    }
}

export function handleDeleteAllPages(): void {
    if (isConnected()) {
        store
            .getState()
            .boardControl.pageRank.forEach((pid) => deletePageSession(pid))
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
        updatePageSession(getCurrentPage().pageId, meta)
    } else {
        store.dispatch(SET_PAGEMETA({ pageId: getCurrentPage().pageId, meta }))
    }
}

export async function handleDocument(e: React.SyntheticEvent): Promise<void> {
    const ev = e.target as HTMLInputElement
    if (ev.files && ev.files[0]) {
        let fileOrigin: Uint8Array | URL
        let attachId = ""
        if (isConnected()) {
            attachId = await addAttachementSession(ev.files[0])
            fileOrigin = getAttachmentURL(attachId)
            await loadNewPDF(fileOrigin)
            handleAddDocumentPages(fileOrigin)
        } else {
            fileOrigin = await getPDFfromForm(ev.files[0])
            await loadNewPDF(fileOrigin)
            handleAddDocumentPages()
        }
    }
}

export function handleAddDocumentPages(attachURL?: URL): void {
    const pages = store.getState().boardControl.docs
    const url = attachURL ? attachURL.toString() : ""

    handleDeleteAllPages()

    pages.forEach((_, i) => {
        const page = new BoardPage(pageType.DOC, i + 1, url)
        if (isConnected()) {
            addPageSession(page, -1)
        } else {
            page.add(-1) // append subsequent pages at the end
        }
    })
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
