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
    const pageId = store.getState().boardControl.present.pageRank[
        store.getState().viewControl.currentPageIndex
    ]
    if (isConnected()) {
        clearPageSession(pageId)
    } else {
        store.dispatch(CLEAR_PAGE(pageId))
    }
}

export function handleDeletePage() {
    const pageId = store.getState().boardControl.present.pageRank[
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
            .boardControl.present.pageRank.forEach((pid) =>
                deletePageSession(pid)
            )
    } else {
        store.dispatch(DELETE_ALL_PAGES())
    }
}
