import {
    addPage,
    deletePage,
    clearPage,
    deleteAllPages,
} from "../../api/request"
import {
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
} from "../../redux/slice/boardcontrol"

import store from "../../redux/store"

export function handleAddPage() {
    const sid = store.getState().webControl.sessionId
    if (sid !== "") {
        addPage(sid, -1)
    } else {
        store.dispatch(ADD_PAGE())
    }
}

export function handleAddPageAt(pageIndex) {
    const sid = store.getState().webControl.sessionId
    if (sid !== "") {
        addPage(sid, pageIndex)
    } else {
        store.dispatch(ADD_PAGE(pageIndex))
    }
}

export function handleClearPage(pageIndex) {
    const sid = store.getState().webControl.sessionId
    if (sid !== "") {
        clearPage(sid, pageIndex)
    } else {
        store.dispatch(CLEAR_PAGE(pageIndex))
    }
}

export function handleDeletePage(pageIndex) {
    const sid = store.getState().webControl.sessionId
    if (sid !== "") {
        deletePage(sid, pageIndex)
    } else {
        store.dispatch(DELETE_PAGE(pageIndex))
    }
}

export function handleDeleteAllPages() {
    const sid = store.getState().webControl.sessionId
    if (sid !== "") {
        deleteAllPages(sid)
    } else {
        store.dispatch(DELETE_ALL_PAGES())
    }
}
