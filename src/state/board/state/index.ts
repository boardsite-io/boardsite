import { Stroke } from "drawing/stroke/index.types"
import { assign, cloneDeep, keys, pick } from "lodash"
import { loadIndexedDB, saveIndexedDB } from "storage/local"
import { GlobalState, RenderTrigger, SerializedState } from "../../index.types"
import { deserializeBoardState, serializeBoardState } from "../serializers"
import { getDefaultBoardState } from "./default"
import {
    AddPageData,
    AddPagesAction,
    AddStrokesAction,
    AttachId,
    Attachment,
    BoardState,
    BoardSubscribers,
    BoardSubscriber,
    ClearPagesAction,
    DeletePagesAction,
    EraseStrokesAction,
    Page,
    PageCollection,
    PageRank,
    SetPageMetaAction,
    PageSubscribers,
    PageLayer,
    PageId,
} from "./index.types"
import {
    addAction,
    addOrUpdateStrokes,
    addPages,
    clearPages,
    deletePages,
    deleteStrokes,
    redoAction,
    undoAction,
    updatePages,
} from "../undoRedo"

export class Board implements GlobalState<BoardState, BoardSubscribers> {
    state: BoardState = getDefaultBoardState()

    subscribers: BoardSubscribers = {
        EditMenu: [],
        MenuPageButton: [],
        RenderNG: [],
        SettingsMenu: [],
    }

    pageSubscribers: PageSubscribers = {}

    addStrokes(addStrokesAction: AddStrokesAction): void {
        const {
            data: strokes,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
            isUpdate,
        } = addStrokesAction

        strokes.sort((a, b) => ((a.id ?? "") > (b.id ?? "") ? 1 : -1))

        const handler = (boardState: BoardState) => {
            addOrUpdateStrokes(boardState, ...strokes)
            sessionHandler?.()
        }

        let undoHandler = (boardState: BoardState) => {
            deleteStrokes(boardState, ...strokes)
            sessionUndoHandler?.()
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
            state: this.state,
            isNew: true,
        })

        const renderedPages: Record<PageId, boolean> = {}
        strokes.forEach((stroke) => {
            if (!renderedPages[stroke.pageId]) {
                renderedPages[stroke.pageId] = true // prevent rerendering twice
                this.renderPageLayer("content", stroke.pageId)
            }
        })

        this.render("EditMenu")
    }

    eraseStrokes(eraseStrokesAction: EraseStrokesAction): void {
        const {
            data: strokes,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
        } = eraseStrokesAction

        const handler = (boardState: BoardState) => {
            deleteStrokes(boardState, ...strokes)
            sessionHandler?.()
        }

        const undoHandler = (boardState: BoardState) => {
            addOrUpdateStrokes(boardState, ...strokes)
            sessionUndoHandler?.()
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
            state: this.state,
            isNew: true,
        })

        const renderedPages: Record<PageId, boolean> = {}
        strokes.forEach((stroke) => {
            if (!renderedPages[stroke.pageId]) {
                renderedPages[stroke.pageId] = true // prevent rerendering twice
                this.renderPageLayer("content", stroke.pageId)
            }
        })

        this.render("EditMenu")
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
        this.render("RenderNG", "EditMenu")
    }

    redoAction(): void {
        redoAction(this.state)
        this.render("RenderNG", "EditMenu")
    }

    decrementPageIndex(): void {
        this.state.currentPageIndex -= 1
        this.render("RenderNG", "MenuPageButton")
        this.clearTransform()
    }

    incrementPageIndex(): void {
        this.state.currentPageIndex += 1
        this.render("RenderNG", "MenuPageButton")
        this.clearTransform()
    }

    jumpToNextPage(): void {
        if (this.state.currentPageIndex < this.state.pageRank.length - 1) {
            this.state.currentPageIndex += 1
        }
        this.render("RenderNG", "MenuPageButton")
        this.clearTransform()
    }

    jumpToPrevPage(): void {
        if (this.state.currentPageIndex > 0) {
            this.state.currentPageIndex -= 1
        }
        this.render("RenderNG", "MenuPageButton")
        this.clearTransform()
    }

    jumpToFirstPage(): void {
        this.state.currentPageIndex = 0
        this.render("RenderNG", "MenuPageButton")
        this.clearTransform()
    }

    jumpToLastPage(): void {
        this.state.currentPageIndex = this.state.pageRank.length - 1
        this.render("RenderNG", "MenuPageButton")
        this.clearTransform()
    }

    toggleShouldCenter(): void {
        this.state.view.keepCentered = !this.state.view.keepCentered
        this.render("SettingsMenu")
    }

    addPages(addPagesAction: AddPagesAction): void {
        const {
            data: addPageData,
            isRedoable,
            sessionHandler,
            sessionUndoHandler,
        } = addPagesAction

        const handler = (boardState: BoardState) => {
            addPages(boardState, ...addPageData)
            sessionHandler?.()
        }

        const undoHandler = (boardState: BoardState) => {
            const pageIds = addPageData.map(({ page }) => page.pageId)
            deletePages(boardState, ...pageIds)
            sessionUndoHandler?.()
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
            state: this.state,
            isNew: true,
        })

        this.render("RenderNG", "EditMenu", "MenuPageButton")
    }

    clearPages(clearPagesAction: ClearPagesAction): void {
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

        const handler = (boardState: BoardState) => {
            clearPages(boardState, ...pageIds)
            sessionHandler?.()
        }

        const undoHandler = (boardState: BoardState) => {
            addOrUpdateStrokes(boardState, ...strokes)
            sessionUndoHandler?.(...strokes)
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
            state: this.state,
            isNew: true,
        })

        this.render("RenderNG", "EditMenu", "MenuPageButton")
    }

    deletePages(deletePagesAction: DeletePagesAction): void {
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
        const pageRank = [...this.state.pageRank]

        const handler = (boardState: BoardState) => {
            deletePages(boardState, ...pageIds)
            sessionHandler?.()
        }

        const undoHandler = (boardState: BoardState) => {
            // set pagerank manually as it was before deletion
            boardState.pageRank = pageRank
            addPages(boardState, ...addPageData)
            sessionUndoHandler?.(...addPageData)
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
            state: this.state,
            isNew: true,
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
        this.render("RenderNG", "EditMenu", "MenuPageButton")
    }

    deleteAllPages(): void {
        this.setState(getDefaultBoardState())
    }

    clearUndoRedo(): void {
        this.state.undoStack = []
        this.state.redoStack = []
    }

    clearTransform(): void {
        this.state.transformStrokes = []
        this.state.strokeUpdates = []

        Object.values(this.pageSubscribers).forEach((pageLayers) =>
            pageLayers?.transformer?.({})
        )
    }

    setTransformStrokes(strokes: Stroke[], pageId: PageId): void {
        this.clearTransform()
        this.state.transformStrokes = strokes
        this.pageSubscribers[pageId]?.transformer?.({})
    }

    setPageMeta(setPageMetaAction: SetPageMetaAction): void {
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

        const handler = (boardState: BoardState) => {
            updatePages(boardState, ...pageUpdates)
            sessionHandler?.()
        }

        const undoHandler = (boardState: BoardState) => {
            updatePages(boardState, ...pages)
            sessionUndoHandler?.(...pages)
        }

        addAction({
            handler,
            undoHandler,
            stack: this.state.undoStack,
            isRedoable,
            state: this.state,
            isNew: true,
        })

        this.render("RenderNG", "EditMenu")
    }

    syncPages(pageRank: PageRank, pageCollection: PageCollection): void {
        this.state.pageRank = pageRank
        this.state.pageCollection = pageCollection

        // Adjust view if necessary
        if (this.state.currentPageIndex > pageRank.length - 1) {
            this.state.currentPageIndex = pageRank.length - 1
            // initialView(state)
        }

        this.render("RenderNG", "EditMenu", "MenuPageButton")
    }

    getState(): BoardState {
        return this.state
    }

    setState(newState: Partial<BoardState>): void {
        assign(this.state, pick(newState, keys(this.state)))
        this.renderAll()
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

    subscribe(subscription: BoardSubscriber, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: BoardSubscriber, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    subscribePage(
        pageLayer: PageLayer,
        pageId: PageId,
        trigger: RenderTrigger
    ): void {
        if (this.pageSubscribers[pageId] === undefined) {
            this.pageSubscribers[pageId] = {}
        }
        this.pageSubscribers[pageId] = {
            ...this.pageSubscribers[pageId],
            [pageLayer]: trigger,
        }
    }

    unsubscribePage(pageLayer: PageLayer, pageId: PageId): void {
        delete this.pageSubscribers[pageId]?.[pageLayer]
    }

    renderPageLayer(pageLayer: PageLayer, pageId: PageId): void {
        this.pageSubscribers[pageId]?.[pageLayer]?.({})
    }

    render(...subscriptions: BoardSubscriber[]): void {
        subscriptions.forEach((sub) => {
            this.subscribers[sub].forEach((trigger) => {
                trigger({})
            })
        })

        // Save to local storage on each render
        this.saveToLocalStorage()
    }

    renderAll(): void {
        Object.values(this.subscribers).forEach((triggerList) => {
            triggerList.forEach((trigger) => {
                trigger({})
            })
        })
    }
}

export const board = new Board()
