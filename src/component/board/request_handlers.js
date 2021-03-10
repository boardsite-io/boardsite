import {
    addPageSession,
    clearPageSession,
    deletePageSession,
    isConnected,
} from "../../api/websocket"
import {
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
} from "../../redux/slice/boardcontrol"

import store from "../../redux/store"
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
    const pageId = store.getState().boardControl.pageRank[
        store.getState().viewControl.currentPageIndex
    ]
    if (isConnected()) {
        clearPageSession(pageId)
    } else {
        store.dispatch(CLEAR_PAGE(pageId))
    }
}

export function handleDeletePage() {
    const pageId = store.getState().boardControl.pageRank[
        store.getState().viewControl.currentPageIndex
    ]
    if (isConnected()) {
        deletePageSession(pageId)
    } else {
        store.dispatch(DELETE_PAGE(pageId))
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
