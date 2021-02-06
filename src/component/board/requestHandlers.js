import { addPage as addPageOnline } from "../../api/request"
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
        addPageOnline(sid, -1)
    } else {
        store.dispatch(ADD_PAGE())
    }
}

export function handleAddPageAt(pageId) {
    store.dispatch(
        ADD_PAGE(store.getState().boardControl.present.pageRank.indexOf(pageId))
    )
}

export function handleDeleteAllPages() {
    store.dispatch(DELETE_ALL_PAGES())
}

export function handleClearPage(pageId) {
    store.dispatch(CLEAR_PAGE(pageId))
}

export function handleDeletePage(pageId) {
    store.dispatch(DELETE_PAGE(pageId))
}
