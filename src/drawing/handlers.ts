import { cloneDeep } from "lodash"
import { Stroke, Tool } from "drawing/stroke/index.types"
import { PAPER } from "consts"
import { drawing } from "state/drawing"
import { board } from "state/board"
import { view } from "state/view"
import { online } from "state/online"
import {
    AddPagesAction,
    AddStrokesAction,
    ClearPagesAction,
    DeletePagesAction,
    EraseStrokesAction,
    PageId,
    PageMeta,
    SetPageMetaAction,
} from "state/board/state/index.types"
import { BoardPage } from "./page"
import { getVerifiedPageIds, getVerifiedPages } from "./helpers"

const createPage = (): BoardPage =>
    new BoardPage().updateMeta(cloneDeep(drawing.getState().pageMeta))

export function handleSetTool(tool: Partial<Tool>): void {
    drawing.setTool(tool)
    board.clearTransform()
}

export function handleAddPageOver(): void {
    const page = createPage()

    const index = board.getState().currentPageIndex
    const addPagesAction: AddPagesAction = {
        data: [{ page, index }],
        isRedoable: true,
    }

    if (online.isConnected()) {
        addPagesAction.sessionHandler = () => online.addPages([page], [index])
        addPagesAction.sessionUndoHandler = () =>
            online.deletePages([page.pageId])
    }

    board.handleAddPages(addPagesAction)
    view.resetView()
}

export function handleAddPageUnder(): void {
    const page = createPage()
    const index = board.getState().currentPageIndex + 1
    const addPagesAction: AddPagesAction = {
        data: [{ page, index }],
        isRedoable: true,
    }

    if (online.isConnected()) {
        addPagesAction.sessionHandler = () => online.addPages([page], [index])
        addPagesAction.sessionUndoHandler = () =>
            online.deletePages([page.pageId])
    }

    board.handleAddPages(addPagesAction)
    board.jumpToNextPage()
    view.resetView()
}

export function handleClearPage(): void {
    handleClearPages([getCurrentPageId()])
}

export function handleClearPages(pageIds: PageId[]): void {
    const verifiedPageIds = getVerifiedPageIds(pageIds)
    const verifiedPages = getVerifiedPages(pageIds)

    const clearPagesAction: ClearPagesAction = {
        data: verifiedPageIds,
        isRedoable: true,
    }

    if (online.isConnected()) {
        clearPagesAction.sessionHandler = () => {
            online.updatePages(verifiedPages, true)
        }
        clearPagesAction.sessionUndoHandler = (undos) => {
            online.sendStrokes(undos)
        }
    }

    board.handleClearPages(clearPagesAction)
}

export function handleDeleteCurrentPage(): void {
    handleDeletePages([getCurrentPageId()], true)
}

export function handleDeletePages(
    pageIds: PageId[],
    isRedoable?: boolean
): void {
    const deletePagesAction: DeletePagesAction = {
        data: pageIds,
        isRedoable,
    }

    if (online.isConnected()) {
        const indices = pageIds.map((pid) =>
            board.getState().pageRank.indexOf(pid)
        )
        deletePagesAction.sessionHandler = () => online.deletePages(pageIds)
        deletePagesAction.sessionUndoHandler = (undos) => {
            const pages = undos.map(({ page }) => page)
            // TODO: send pagerank
            online.addPages(pages, indices as number[])
        }
    }

    board.handleDeletePages(deletePagesAction)
}

export function handleDeleteAllPages(isRedoable?: boolean): void {
    handleDeletePages(board.getState().pageRank.slice(), isRedoable)
}

export function handleAddStrokes(strokes: Stroke[], isUpdate: boolean): void {
    strokes.sort((a, b) => ((a.id ?? "") > (b.id ?? "") ? 1 : -1))

    const addStrokesAction: AddStrokesAction = {
        data: strokes,
        isUpdate,
        isRedoable: true,
    }

    if (online.isConnected()) {
        addStrokesAction.sessionHandler = () => online.sendStrokes(strokes)
        addStrokesAction.sessionUndoHandler = () => online.eraseStrokes(strokes)
    }

    board.handleAddStrokes(addStrokesAction)
}

export function handleDeleteStrokes(
    strokes: Stroke[],
    offlineOnly = false
): void {
    const eraseStrokesAction: EraseStrokesAction = {
        data: strokes,
        isRedoable: true,
    }

    if (!offlineOnly && online.isConnected()) {
        eraseStrokesAction.sessionHandler = () => online.eraseStrokes(strokes)
        eraseStrokesAction.sessionUndoHandler = () =>
            online.sendStrokes(strokes)
    }

    board.handleEraseStrokes(eraseStrokesAction)
}

export function handleUndo(): void {
    board.clearTransform()
    board.undoAction()
}

export function handleRedo(): void {
    board.clearTransform()
    board.redoAction()
}

export function handleChangePageBackground(): void {
    // update the default page type
    const currentPage = getCurrentPage()
    // there is no current page, eg. when all pages have been removed
    if (!currentPage) {
        return
    }
    // cannot update background of doc type
    if (currentPage.meta.background.paper === PAPER.DOC) {
        return
    }

    const newMeta = cloneDeep<PageMeta>(currentPage.meta)
    newMeta.background.paper = drawing.getState().pageMeta.background.paper

    const pageUpdate = {
        pageId: currentPage.pageId,
        meta: newMeta,
    }

    const setPageMetaAction: SetPageMetaAction = {
        data: [pageUpdate],
        isRedoable: true,
    }

    if (online.isConnected()) {
        setPageMetaAction.sessionHandler = () =>
            online.updatePages([pageUpdate], false)
        setPageMetaAction.sessionUndoHandler = (undos) =>
            online.updatePages(undos, false)
    }

    board.handleSetPageMeta(setPageMetaAction)
}

function getCurrentPageId() {
    const { pageRank, currentPageIndex } = board.getState()
    return pageRank[currentPageIndex]
}

function getCurrentPage() {
    const { pageRank, pageCollection, currentPageIndex } = board.getState()
    return pageCollection[pageRank[currentPageIndex]]
}
