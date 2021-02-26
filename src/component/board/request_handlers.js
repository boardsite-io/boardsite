import {
    addPageSession,
    clearPageSession,
    deletePageSession,
    eraseStroke,
    isConnected,
    sendStroke,
} from "../../api/websocket"
import {
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    UPDATE_STROKE,
    ERASE_STROKE,
    ADD_STROKE,
} from "../../redux/slice/boardcontrol"

import store from "../../redux/store"

export function handleAddPageOver() {
    const pageIndex = store.getState().viewControl.currentPageIndex
    if (isConnected()) {
        addPageSession(pageIndex)
    } else {
        store.dispatch(ADD_PAGE(pageIndex))
    }
}

export function handleAddPageUnder() {
    const pageIndex = store.getState().viewControl.currentPageIndex
    if (isConnected()) {
        addPageSession(pageIndex + 1)
    } else {
        store.dispatch(ADD_PAGE(pageIndex + 1))
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
    // add stroke to collection
    store.dispatch(ADD_STROKE(stroke))
    if (isConnected()) {
        // relay stroke in session
        sendStroke(stroke)
    }
}

export function handleUpdateStroke({ x, y, id, pageId }) {
    store.dispatch(UPDATE_STROKE({ x, y, id, pageId }))
    if (isConnected()) {
        // send updated stroke
        sendStroke(
            store.getState().boardControl.pageCollection[pageId].strokes[id]
        )
    }
}

export function handleDeleteStroke({ pageId, id }) {
    store.dispatch(ERASE_STROKE({ pageId, id }))
    if (isConnected()) {
        eraseStroke({ pageId, id })
    }
}
