import {
    addPageSession,
    updatePageSession,
    deletePageSession,
    isConnected,
} from "../api/websocket"
import {
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    SET_PAGEMETA,
} from "../redux/slice/boardcontrol"
import { SET_STATIC_PAGEBG } from "../redux/slice/drawcontrol"

import store from "../redux/store"
import { newPage, newPageMeta } from "./page"
import { addStroke, deleteStroke, redo, undo, updateStroke } from "./undoredo"

export function handleAddPageOver() {
    const page = newPage(store.getState().viewControl.currentPageIndex)
    if (isConnected()) {
        addPageSession(page)
    } else {
        store.dispatch(ADD_PAGE(page))
    }
}

export function handleAddPageUnder() {
    const page = newPage(store.getState().viewControl.currentPageIndex + 1)
    if (isConnected()) {
        addPageSession(page)
    } else {
        store.dispatch(ADD_PAGE(page))
    }
}

export function handleClearPage() {
    if (isConnected()) {
        updatePageSession(getCurrentPageId(), {}, true)
    } else {
        store.dispatch(CLEAR_PAGE(getCurrentPageId()))
    }
}

export function handleDeletePage() {
    if (isConnected()) {
        deletePageSession(getCurrentPageId())
    } else {
        store.dispatch(DELETE_PAGE(getCurrentPageId()))
    }
}

export function handleDeleteAllPages() {
    if (isConnected()) {
        store
            .getState()
            .boardControl.pageRank.forEach((pid) => deletePageSession(pid))
    } else {
        store.dispatch(DELETE_ALL_PAGES())
    }
}

export function handleAddStroke(stroke) {
    addStroke(stroke)
}

export function handleUpdateStroke(stroke) {
    updateStroke(stroke)
}

export function handleDeleteStroke(stroke) {
    deleteStroke(stroke)
}

export function handleUndo() {
    undo()
}

export function handleRedo() {
    redo()
}

// selection of new (static) page background
export function handlePageBackground(style) {
    store.dispatch(SET_STATIC_PAGEBG(style))
    const meta = newPageMeta()
    // update the current page
    if (isConnected()) {
        updatePageSession(getCurrentPageId(), meta)
    } else {
        store.dispatch(
            SET_PAGEMETA({
                pageId: getCurrentPageId(),
                meta,
            })
        )
    }
}

function getCurrentPageId() {
    return store.getState().boardControl.pageRank[
        store.getState().viewControl.currentPageIndex
    ]
}
