import { cloneDeep } from "lodash"
import { Stroke, Tool } from "drawing/stroke/index.types"
import {
    CLEAR_PAGES,
    DELETE_PAGES,
    SET_PAGEMETA,
    ADD_PAGES,
    ADD_STROKES,
    ERASE_STROKES,
    UNDO_ACTION,
    REDO_ACTION,
    CLEAR_TRANSFORM,
    JUMP_TO_NEXT_PAGE,
} from "redux/board/board"
import { currentSession, isConnected } from "api/session"
import { backgroundStyle } from "consts"
import store from "redux/store"
import { SET_TOOL } from "redux/drawing/drawing"
import {
    PageMeta,
    DeletePages,
    AddPages,
    AddStrokes,
    EraseStrokes,
    PageId,
    ClearPages,
    SetPageMeta,
} from "redux/board/board.types"
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
    const payload: AddPages = {
        data: [{ page, index }],
        isRedoable: true,
    }

    if (isConnected()) {
        const session = currentSession()
        payload.sessionHandler = () => session.addPages([page], [index])
        payload.sessionUndoHandler = () => session.deletePages([page.pageId])
    }

    store.dispatch(ADD_PAGES(payload))
}

export function handleAddPageUnder(): void {
    const page = createPage()
    const index = store.getState().board.currentPageIndex + 1
    const payload: AddPages = {
        data: [{ page, index }],
        isRedoable: true,
    }

    if (isConnected()) {
        const session = currentSession()
        payload.sessionHandler = () => session.addPages([page], [index])
        payload.sessionUndoHandler = () => session.deletePages([page.pageId])
    }

    store.dispatch(ADD_PAGES(payload))
    store.dispatch(JUMP_TO_NEXT_PAGE())
}

export function handleClearPage(): void {
    handleClearPages([getCurrentPageId()])
}

export function handleClearPages(pageIds: PageId[]): void {
    const payload: ClearPages = {
        data: pageIds,
        isRedoable: true,
    }

    if (isConnected()) {
        const session = currentSession()
        const pages = pageIds.map(
            (pid) => store.getState().board.pageCollection[pid]
        )
        payload.sessionHandler = () => {
            session.updatePages(pages, true)
        }
        payload.sessionUndoHandler = (...undos) => {
            session.sendStrokes(undos)
        }
    }

    store.dispatch(CLEAR_PAGES(payload))
}

export function handleDeleteCurrentPage(): void {
    handleDeletePages([getCurrentPageId()], true)
}

export function handleDeletePages(
    pageIds: PageId[],
    isRedoable?: boolean
): void {
    const payload: DeletePages = {
        data: pageIds,
        isRedoable,
    }

    if (isConnected()) {
        const session = currentSession()
        const indices = pageIds.map((pid) =>
            store.getState().board.pageRank.indexOf(pid)
        )
        payload.sessionHandler = () => session.deletePages(pageIds)
        payload.sessionUndoHandler = (...undos) => {
            const pages = undos.map(({ page }) => page)
            // TODO: send pagerank
            session.addPages(pages, indices as number[])
            session.sendStrokes(
                pages.reduce<Stroke[]>(
                    (arr, page) => arr.concat(Object.values(page.strokes)),
                    []
                )
            )
        }
    }

    store.dispatch(DELETE_PAGES(payload))
}

export function handleDeleteAllPages(isRedoable?: boolean): void {
    handleDeletePages(store.getState().board.pageRank, isRedoable)
}

export function handleAddStrokes(strokes: Stroke[], isUpdate: boolean): void {
    const payload: AddStrokes = {
        data: strokes,
        isUpdate,
        isRedoable: true,
    }

    if (isConnected()) {
        const session = currentSession()
        payload.sessionHandler = () => session.sendStrokes(strokes)
        payload.sessionUndoHandler = () => session.eraseStrokes(strokes)
    }

    store.dispatch(ADD_STROKES(payload))
}

export function handleDeleteStrokes(strokes: Stroke[]): void {
    const payload: EraseStrokes = {
        data: strokes,
        isRedoable: true,
    }

    if (isConnected()) {
        const session = currentSession()
        payload.sessionHandler = () => session.eraseStrokes(strokes)
        payload.sessionUndoHandler = () => session.sendStrokes(strokes)
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

    const pageUpdate = {
        pageId: currentPage.pageId,
        meta: newMeta,
    }

    const payload: SetPageMeta = {
        data: [pageUpdate],
        isRedoable: true,
    }

    if (isConnected()) {
        const session = currentSession()
        payload.sessionHandler = () => session.updatePages([pageUpdate], false)
        payload.sessionUndoHandler = (...undos) =>
            session.updatePages(undos, false)
    }

    store.dispatch(SET_PAGEMETA(payload))
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
