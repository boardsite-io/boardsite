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

export function handleAddPageAt(pageId) {
    const sid = store.getState().webControl.sessionId
    if (sid !== "") {
        addPage(sid, pageId)
    } else {
        store.dispatch(
            ADD_PAGE(
                store.getState().boardControl.present.pageRank.indexOf(pageId)
            )
        )
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

export function handleClearPage(pageId) {
    const sid = store.getState().webControl.sessionId
    if (sid !== "") {
        clearPage(sid, pageId)
    } else {
        store.dispatch(CLEAR_PAGE(pageId))
    }
}

export function handleDeletePage(pageId) {
    const sid = store.getState().webControl.sessionId
    if (sid !== "") {
        deletePage(sid, pageId)
    } else {
        store.dispatch(DELETE_PAGE(pageId))
    }
}
