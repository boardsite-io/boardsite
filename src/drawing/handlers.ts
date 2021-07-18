import {
    addPageSession,
    updatePageSession,
    deletePageSession,
    isConnected,
} from "../api/websocket"
import {
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    SET_PAGEBG,
} from "../redux/slice/boardcontrol"

import store from "../redux/store"
import { PageBackground, PageMeta, Stroke } from "../types"
import { BoardPage } from "./page"
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
    if (isConnected()) {
        const meta: PageMeta = { background: { style } }
        updatePageSession(getCurrentPageId(), meta)
    } else {
        store.dispatch(SET_PAGEBG({ pageId: getCurrentPageId(), style }))
    }
}

function getCurrentPageId() {
    return store.getState().boardControl.pageRank[
        store.getState().viewControl.currentPageIndex
    ]
}
