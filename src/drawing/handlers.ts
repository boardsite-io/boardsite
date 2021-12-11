import { cloneDeep } from "lodash"
import { Stroke, Tool } from "drawing/stroke/index.types"
import {
    CLEAR_PAGE,
    DELETE_PAGES,
    DELETE_ALL_PAGES,
    SET_PAGEMETA,
    ADD_PAGE,
    ADD_STROKES,
    ERASE_STROKES,
    UNDO_ACTION,
    REDO_ACTION,
    CLEAR_TRANSFORM,
    JUMP_TO_NEXT_PAGE,
} from "redux/board/board"
import {
    addPagesSession,
    updatePagesSession,
    deletePagesSession,
    isConnected,
    sendStrokes,
    eraseStrokes,
    getUserId,
    getSocket,
} from "api/websocket"
import { backgroundStyle } from "consts"
import store from "redux/store"
import { SET_TOOL } from "redux/drawing/drawing"
import { PageMeta, StrokeAction } from "redux/board/board.types"
import { BoardPage } from "./page"

const createPage = (): BoardPage =>
    new BoardPage().updateMeta(store.getState().board.pageMeta)

export function handleSetTool(tool: Partial<Tool>): void {
    store.dispatch(SET_TOOL(tool))
    store.dispatch(CLEAR_TRANSFORM())
}

export function handleAddPageOver(): void {
    const page = createPage()
    const index = store.getState().board.currentPageIndex
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        store.dispatch(ADD_PAGE({ page, index }))
    }
}

export function handleAddPageUnder(): void {
    const page = createPage()
    const index = store.getState().board.currentPageIndex + 1
    if (isConnected()) {
        addPagesSession([page], [index])
    } else {
        store.dispatch(ADD_PAGE({ page, index }))
    }
    store.dispatch(JUMP_TO_NEXT_PAGE())
}

export function handleClearPage(): void {
    if (isConnected()) {
        updatePagesSession(true, getCurrentPage())
    } else {
        store.dispatch(CLEAR_PAGE(getCurrentPageId()))
    }
}

export function handleDeleteCurrentPage(): void {
    handleDeletePages(...getCurrentPageId())
}

export function handleDeletePages(...pageIds: string[]): void {
    if (isConnected()) {
        deletePagesSession(...pageIds)
    } else {
        store.dispatch(DELETE_PAGES([getCurrentPageId()]))
    }
}

export function handleDeleteAllPages(): void {
    if (isConnected()) {
        deletePagesSession(...store.getState().board.pageRank)
    } else {
        store.dispatch(DELETE_ALL_PAGES())
    }
}

export function handleAddStrokes(
    isUpdate: boolean,
    ...strokes: Stroke[]
): void {
    const payload: StrokeAction = {
        strokes,
        isUpdate,
        isRedoable: true,
    }

    if (isConnected()) {
        const ws = getSocket()
        const userId = getUserId()
        payload.sessionHandler = () => sendStrokes(ws, userId, ...strokes)
        payload.sessionUndoHandler = () => sendStrokes(ws, userId, ...strokes)
    }

    store.dispatch(ADD_STROKES(payload))
}

export function handleDeleteStrokes(...strokes: Stroke[]): void {
    const payload: StrokeAction = {
        strokes,
        isRedoable: true,
    }

    if (isConnected()) {
        const ws = getSocket()
        const userId = getUserId()
        payload.sessionHandler = () => eraseStrokes(ws, userId, ...strokes)
        payload.sessionUndoHandler = () => sendStrokes(ws, userId, ...strokes)
    }

    store.dispatch(ERASE_STROKES(payload))
}

export function handleUndo(): void {
    store.dispatch(CLEAR_TRANSFORM())
    store.dispatch(UNDO_ACTION())
}

export function handleRedo(): void {
    store.dispatch(CLEAR_TRANSFORM())
    store.dispatch(REDO_ACTION())
}

export function handleChangePageBackground(): void {
    // update the default page type
    const currentPage = getCurrentPage()
    // there is no current page, eg. when all pages have been removed
    if (!currentPage) {
        return
    }
    // cannot update background of doc type
    if (currentPage.meta.background.style === backgroundStyle.DOC) {
        return
    }

    const newMeta = cloneDeep<PageMeta>(currentPage.meta)
    newMeta.background.style = store.getState().board.pageMeta.background.style

    if (isConnected()) {
        updatePagesSession(false, currentPage.updateMeta(newMeta))
    } else {
        store.dispatch(
            SET_PAGEMETA({ pageId: currentPage.pageId, meta: newMeta })
        )
    }
}

function getCurrentPageId() {
    return store.getState().board.pageRank[
        store.getState().board.currentPageIndex
    ]
}

function getCurrentPage() {
    return store.getState().board.pageCollection[
        store.getState().board.pageRank[store.getState().board.currentPageIndex]
    ]
}
