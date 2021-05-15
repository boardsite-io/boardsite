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
import { SET_DEFAULT_PAGEBG } from "../redux/slice/drawcontrol"

import store from "../redux/store"
import { addStroke, deleteStroke, redo, undo, updateStroke } from "./undoredo"

export function handleAddPageOver() {
    const pageIndex = store.getState().viewControl.currentPageIndex
    const meta = { background: store.getState().drawControl.pageBG }
    if (isConnected()) {
        addPageSession(pageIndex, meta)
    } else {
        store.dispatch(
            ADD_PAGE({
                pageIndex,
                meta,
            })
        )
    }
}

export function handleAddPageUnder() {
    const pageIndex = store.getState().viewControl.currentPageIndex
    const meta = { background: store.getState().drawControl.pageBG }
    if (isConnected()) {
        addPageSession(pageIndex + 1, meta)
    } else {
        store.dispatch(
            ADD_PAGE({
                pageIndex: pageIndex + 1,
                meta,
            })
        )
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

export function handlePageBackground(style) {
    store.dispatch(SET_DEFAULT_PAGEBG(style))
    if (isConnected()) {
        updatePageSession(getCurrentPageId(), { background: style })
    } else {
        store.dispatch(
            SET_PAGEMETA({
                pageId: getCurrentPageId(),
                meta: { background: style },
            })
        )
    }
}

function getCurrentPageId() {
    return store.getState().boardControl.pageRank[
        store.getState().viewControl.currentPageIndex
    ]
}
