import { BoardStroke } from "drawing/stroke"
import { Stroke, StrokeUpdate } from "drawing/stroke/index.types"
import { subscriptionState } from "state/subscription"
import { assign, cloneDeep, keys, pick } from "lodash"
import { loadIndexedDB, saveIndexedDB } from "storage/local"
import { GlobalState, SerializedState } from "../../types"
import { deserializeBoardState, serializeBoardState } from "../serializers"
import { getDefaultBoardState } from "./default"
import {
    AddPageData,
    AddPagesAction,
    AddStrokesAction,
    AttachId,
    Attachment,
    BoardState,
    ClearPagesAction,
    DeletePagesAction,
    EraseStrokesAction,
    Page,
    PageCollection,
    PageRank,
    SetPageMetaAction,
    PageId,
} from "./index.types"
import { addAction, redoAction, undoAction } from "../undoRedo"

export class Board implements GlobalState<BoardState> {
    state: BoardState = getDefaultBoardState()

    getState(): BoardState {
        return this.state
    }

    setState(newState: Partial<BoardState>): void {
        assign(this.state, pick(newState, keys(this.state)))
        subscriptionState.render("RenderNG", "EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
    }

    addAttachments(attachments: Attachment[]): void {
        attachments.forEach((attachment) => {
            this.state.attachments[attachment.id] = attachment
        })
    }

    deleteAttachments(attachIds: AttachId[]): void {
        attachIds.forEach((attachId) => {
            delete this.state.attachments[attachId]
        })
    }

    clearAttachments(): void {
        this.state.attachments = {}
    }

    undoAction(): void {
        undoAction(this.state)
        subscriptionState.render("RenderNG", "EditMenu")
        this.saveToLocalStorage()
    }

    redoAction(): void {
        redoAction(this.state)
        subscriptionState.render("RenderNG", "EditMenu")
        this.saveToLocalStorage()
    }

    decrementPageIndex(): void {
        this.state.currentPageIndex -= 1
        subscriptionState.render("RenderNG", "MenuPageButton")
        this.clearTransform()
        this.saveToLocalStorage()
    }

    incrementPageIndex(): void {
        this.state.currentPageIndex += 1
        subscriptionState.render("RenderNG", "MenuPageButton")
        this.clearTransform()
        this.saveToLocalStorage()
    }

    jumpToNextPage(): void {
        if (this.state.currentPageIndex < this.state.pageRank.length - 1) {
            this.state.currentPageIndex += 1
        }
        subscriptionState.render("RenderNG", "MenuPageButton")
        this.clearTransform()
        this.saveToLocalStorage()
    }

    jumpToPrevPage(): void {
        if (this.state.currentPageIndex > 0) {
            this.state.currentPageIndex -= 1
        }
        subscriptionState.render("RenderNG", "MenuPageButton")
        this.clearTransform()
        this.saveToLocalStorage()
    }

    jumpToFirstPage(): void {
        this.state.currentPageIndex = 0
        subscriptionState.render("RenderNG", "MenuPageButton")
        this.clearTransform()
        this.saveToLocalStorage()
    }

    jumpToLastPage(): void {
        this.state.currentPageIndex = this.state.pageRank.length - 1
        subscriptionState.render("RenderNG", "MenuPageButton")
        this.clearTransform()
        this.saveToLocalStorage()
    }

    /**
     * Undoable action handlers
     */

    handleAddStrokes(addStrokesAction: AddStrokesAction): void {
        const {
            data: strokes,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
            isUpdate,
        } = addStrokesAction

        const handler = () => {
            this.addOrUpdateStrokes(strokes)
            sessionHandler?.([])
        }

        let undoHandler = () => {
            this.deleteStrokes(strokes)
            sessionUndoHandler?.([])
        }

        if (isUpdate) {
            const addUpdateStartPoint = this.state.undoStack?.pop()?.handler

            if (addUpdateStartPoint) {
                undoHandler = addUpdateStartPoint
            }
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
        })

        this.clearRedoCheck(isRedoable)
    }

    handleEraseStrokes(eraseStrokesAction: EraseStrokesAction): void {
        const {
            data: strokes,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
        } = eraseStrokesAction

        const handler = () => {
            this.deleteStrokes(strokes)
            sessionHandler?.([])
        }

        const undoHandler = () => {
            this.addOrUpdateStrokes(strokes)
            sessionUndoHandler?.([])
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
        })

        this.clearRedoCheck(isRedoable)
    }

    handleAddPages(addPagesAction: AddPagesAction): void {
        const {
            data: addPageData,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
        } = addPagesAction

        const pageIds = addPageData.map(({ page }) => page.pageId)

        const handler = () => {
            this.addPages(addPageData)
            sessionHandler?.([])
        }

        const undoHandler = () => {
            this.deletePages(pageIds)
            sessionUndoHandler?.([])
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
        })

        this.clearRedoCheck(isRedoable)
    }

    handleClearPages(clearPagesAction: ClearPagesAction): void {
        const {
            data: pageIds,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
        } = clearPagesAction

        // make a copy of cleared strokes
        const strokes = pageIds
            .map((pid) => cloneDeep(this.state.pageCollection[pid]))
            .filter((page) => page !== undefined)
            .reduce<Stroke[]>(
                (arr, page) =>
                    arr.concat(Object.values((page as Page).strokes)),
                []
            )

        const handler = () => {
            this.clearPages(pageIds)
            sessionHandler?.([])
        }

        const undoHandler = () => {
            this.addOrUpdateStrokes(strokes)
            sessionUndoHandler?.(strokes)
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
        })

        this.clearRedoCheck(isRedoable)
    }

    handleDeletePages(deletePagesAction: DeletePagesAction): void {
        const {
            data: pageIds,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
        } = deletePagesAction

        const addPageData = pageIds
            .map<AddPageData>((pid) => ({
                page: this.state.pageCollection[pid] as Page,
            }))
            .filter(({ page }) => page !== undefined)
        const pageRank = this.state.pageRank.slice()

        const handler = () => {
            this.deletePages(pageIds)
            sessionHandler?.([])
        }

        const undoHandler = () => {
            // set pagerank manually as it was before deletion
            this.state.pageRank = pageRank
            this.addPages(addPageData)
            sessionUndoHandler?.(addPageData)
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
        })

        this.clearRedoCheck(isRedoable)
    }

    handleSetPageMeta(setPageMetaAction: SetPageMetaAction): void {
        const {
            data: pageUpdates,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
        } = setPageMetaAction

        // make a copy of old page meta
        const pages = pageUpdates.map((page) =>
            cloneDeep(
                pick(this.state.pageCollection[page.pageId], ["pageId", "meta"])
            )
        ) as Page[]

        const handler = () => {
            this.updatePages(pageUpdates)
            sessionHandler?.([])
        }

        const undoHandler = () => {
            this.updatePages(pages)
            sessionUndoHandler?.(pages)
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
        })

        this.clearRedoCheck(isRedoable)
    }

    /**
     * Internal Undoable Functions
     */

    addOrUpdateStrokes(strokes: Stroke[] | StrokeUpdate[]): void {
        strokes.forEach((stroke) => {
            const page = this.getState().pageCollection[stroke.pageId ?? ""]
            if (page && stroke.id) {
                if (page.strokes[stroke.id]) {
                    // stroke exists -> update
                    page.strokes[stroke.id].update(stroke)
                } else {
                    page.strokes[stroke.id] = new BoardStroke(stroke as Stroke)
                }
            }
        })
        this.renderPagesWithStrokeChanges(strokes)
    }

    deleteStrokes(strokes: Stroke[] | StrokeUpdate[]): void {
        strokes.forEach(({ id, pageId }) => {
            const page = this.getState().pageCollection[pageId ?? ""]
            if (page && id) {
                delete page.strokes[id]
            }
        })
        this.renderPagesWithStrokeChanges(strokes)
    }

    // eslint-disable-next-line class-methods-use-this
    renderPagesWithStrokeChanges(strokes: Stroke[] | StrokeUpdate[]): void {
        const renderedPages: Record<PageId, boolean> = {}
        strokes.forEach((stroke) => {
            const { pageId } = stroke
            if (pageId && !renderedPages[pageId]) {
                renderedPages[pageId] = true // prevent rerendering twice
                subscriptionState.renderPageLayer("content", pageId)
            }
        })
        subscriptionState.render("EditMenu")
        this.saveToLocalStorage()
    }

    addPages(addPageData: AddPageData[]): void {
        addPageData.forEach(({ page, index }) => {
            this.getState().pageCollection[page.pageId] = page
            if (index !== undefined) {
                if (index >= 0) {
                    this.getState().pageRank.splice(index, 0, page.pageId)
                } else {
                    this.getState().pageRank.push(page.pageId)
                }
            }
        })
        subscriptionState.render("RenderNG", "EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
    }

    deletePages(pageIds: PageId[]): void {
        const { pageRank, pageCollection } = this.getState()
        pageIds.forEach((pid) => {
            pageRank.splice(pageRank.indexOf(pid), 1)
            delete pageCollection[pid]
        })

        if (!this.state.pageRank.length) {
            // All pages have been deleted so view and index can be reset
            this.state.currentPageIndex = 0
        } else if (
            this.state.currentPageIndex >
            this.state.pageRank.length - 1
        ) {
            // Deletions have caused the current page index to exceed
            // the page limit, therefore we move to the last page
            this.state.currentPageIndex = this.state.pageRank.length - 1
        }

        // Make sure that transform is cleared when page is deleted
        this.clearTransform()
        subscriptionState.render("RenderNG", "EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
    }

    clearPages(pageIds: PageId[]): void {
        pageIds.forEach((pageId) => {
            this.getState().pageCollection[pageId]?.clear()
            subscriptionState.renderPageLayer("content", pageId)
        })
        subscriptionState.render("EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
    }

    updatePages(pages: Pick<Page, "pageId" | "meta">[]): void {
        pages.forEach((page) => {
            this.getState().pageCollection[page.pageId]?.updateMeta(page.meta)
        })
        subscriptionState.render("RenderNG", "EditMenu")
        this.saveToLocalStorage()
    }

    deleteAllPages(): void {
        this.setState(getDefaultBoardState())
        subscriptionState.render("RenderNG")
        this.saveToLocalStorage()
    }

    clearRedoCheck(isRedoable?: boolean): void {
        if (isRedoable) {
            this.state.redoStack = []
            subscriptionState.render("EditMenu")
        }
    }

    clearUndoRedo(): void {
        this.state.undoStack = []
        this.state.redoStack = []
        subscriptionState.render("EditMenu")
    }

    clearTransform(): void {
        this.state.transformStrokes = []
        this.state.strokeUpdates = []

        Object.values(subscriptionState.pageSubscribers).forEach((pageLayers) =>
            pageLayers?.transformer?.({})
        )
    }

    setTransformStrokes(strokes: Stroke[], pageId: PageId): void {
        this.clearTransform()
        this.state.transformStrokes = strokes
        subscriptionState.pageSubscribers[pageId]?.transformer?.({})
    }

    syncPages(pageRank: PageRank, pageCollection: PageCollection): void {
        this.state.pageRank = pageRank
        this.state.pageCollection = pageCollection

        // Adjust view if necessary
        if (
            pageRank.length &&
            this.state.currentPageIndex > pageRank.length - 1
        ) {
            this.state.currentPageIndex = pageRank.length - 1
        }

        subscriptionState.render("RenderNG", "EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
    }

    getSerializedState(): SerializedState<BoardState> {
        return serializeBoardState(this.getState())
    }

    async setSerializedState(
        serializedState: SerializedState<BoardState>
    ): Promise<void> {
        const deserializedState = await deserializeBoardState(serializedState)
        this.setState(deserializedState)
    }

    saveToLocalStorage(): void {
        const serializedState = this.getSerializedState()
        saveIndexedDB("board", serializedState)
    }

    async loadFromLocalStorage(): Promise<void> {
        const serializedState = await loadIndexedDB("board")
        if (serializedState === null) return
        await this.setSerializedState(serializedState)
    }
}

export const board = new Board()
