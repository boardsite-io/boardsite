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
import { PageBackground, Stroke } from "../types"
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
    if (isConnected()) {
        // addPageSession(page)
    } else {
        page.add(store.getState().viewControl.currentPageIndex)
    }
}

export function handleAddPageUnder(): void {
    const page = new BoardPage()
    if (isConnected()) {
        // addPageSession(page)
    } else {
        page.add(store.getState().viewControl.currentPageIndex + 1)
    }
}

export function handleClearPage(): void {
    if (isConnected()) {
        updatePageSession(getCurrentPageId(), {}, true)
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

export function handleUpdateStroke(stroke: Stroke): void {
    updateStrokes([stroke])
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
    store.dispatch(SET_PAGEBG({ pageId: getCurrentPageId(), style }))
    if (isConnected()) {
        // updatePageSession(getCurrentPageId(), meta)
    }
}

function getCurrentPageId() {
    return store.getState().boardControl.pageRank[
        store.getState().viewControl.currentPageIndex
    ]
}
