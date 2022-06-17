import { BoardStroke } from "drawing/stroke"
import { Stroke, StrokeUpdate } from "drawing/stroke/index.types"
import { subscriptionState } from "state/subscription"
import { GlobalState } from "state/types"
import { assign, cloneDeep, keys, pick } from "lodash"
import { PAGE_SIZE } from "consts"
import { PageIndex } from "state/view/state/index.types"
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
    PageSize,
} from "./index.types"
import { addAction, redoAction, undoAction } from "../undoRedo"
import { BoardSerializer } from "../serializers"

export class Board extends BoardSerializer implements GlobalState<BoardState> {
    getState(): BoardState {
        return this.state
    }

    setState(newState: Partial<BoardState>) {
        assign(this.state, pick(newState, keys(this.state)))
        subscriptionState.render("RenderNG", "EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
        return this
    }

    override async loadFromLocalStorage(): Promise<BoardState> {
        const state = await super.loadFromLocalStorage()
        subscriptionState.render("RenderNG", "EditMenu", "MenuPageButton")
        return state
    }

    getPageId(pageIndex: PageIndex) {
        const { pageRank } = this.state
        return pageRank[pageIndex]
    }

    getPage(pageIndex: PageIndex) {
        const { pageRank, pageCollection } = this.state
        return pageCollection[pageRank[pageIndex]]
    }

    /**
     * Add new attachments
     * @param attachments new attachments
     */
    addAttachments(attachments: Attachment[]): void {
        attachments.forEach((attachment) => {
            this.state.attachments[attachment.id] = attachment
        })
        this.saveToLocalStorage()
    }

    /**
     * Delete specified attachments
     * @param attachIds ids of attachments to be remove
     */
    deleteAttachments(attachIds: AttachId[]): void {
        attachIds.forEach((attachId) => {
            delete this.state.attachments[attachId]
        })
        this.saveToLocalStorage()
    }

    /**
     * Clear all attachments
     */
    clearAttachments(): void {
        this.state.attachments = {}
        this.saveToLocalStorage()
    }

    /**
     * Undo last action
     */
    undoAction(): void {
        undoAction(this.state)
        subscriptionState.render("RenderNG", "EditMenu")
        this.saveToLocalStorage()
    }

    /**
     * Redo last action
     */
    redoAction(): void {
        redoAction(this.state)
        subscriptionState.render("RenderNG", "EditMenu")
        this.saveToLocalStorage()
    }

    /**
     * Clear undo and redo stack
     */
    clearUndoRedo(): void {
        this.state.undoStack = []
        this.state.redoStack = []
        subscriptionState.render("EditMenu")
    }

    /**
     * Clear shape transformer
     */
    clearTransform(): void {
        this.state.transformStrokes = []
        this.state.strokeUpdates = []

        Object.values(subscriptionState.pageSubscribers).forEach((pageLayers) =>
            pageLayers?.transformer?.({})
        )
    }

    /**
     * Delete all pages - essentially a full board state reset
     */
    fullReset(): void {
        this.setState(getDefaultBoardState())
        subscriptionState.render("RenderNG")
        this.saveToLocalStorage()
    }

    /**
     * Add strokes to the shape transformer
     * @param strokes shapes to be added to the shape transformer
     * @param pageId page on which the transformer is active
     */
    setTransformStrokes(strokes: Stroke[], pageId: PageId): void {
        this.clearTransform()
        this.state.transformStrokes = strokes
        subscriptionState.pageSubscribers[pageId]?.transformer?.({})
    }

    /**
     * Set the pagerank and pagecollection - this will override the current states
     * @param pageRank new pageRank
     * @param pageCollection new pageCollection
     */
    syncPages(pageRank: PageRank, pageCollection: PageCollection): void {
        this.state.pageRank = pageRank
        this.state.pageCollection = pageCollection
        subscriptionState.render("RenderNG", "EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
    }

    /**
     * Util function to get the page size of a specified page
     * @param pageIndex page index
     * @returns pageSize of target page
     */
    getPageSize(pageIndex: PageIndex): PageSize {
        const { pageRank, pageCollection } = this.getState()
        const pageId = pageRank[pageIndex]
        return pageCollection[pageId]?.meta?.size ?? PAGE_SIZE.A4_LANDSCAPE
    }

    /* --- Undoable action handlers --- */

    /**
     * Action: Add strokes
     * @param addStrokesAction action object
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

    /**
     * Action: Erase strokes
     * @param eraseStrokesAction action object
     */
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

    /**
     * Action: Add pages
     * @param addPagesAction action object
     */
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

    /**
     * Action: Clear pages
     * @param clearPagesAction action object
     */
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

    /**
     * Action: Delete pages
     * @param deletePagesAction action object
     */
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

    /**
     * Action: Update page meta of one or more pages
     * @param setPageMetaAction action object
     */
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

    /* --- Internal Undoable Functions --- */

    /**
     * Add or update strokes
     * @param strokes new strokes or stroke updates
     */
    private addOrUpdateStrokes(strokes: Stroke[] | StrokeUpdate[]): void {
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

    /**
     * Delete strokes
     * @param strokes strokes to be deleted
     */
    private deleteStrokes(strokes: Stroke[] | StrokeUpdate[]): void {
        strokes.forEach(({ id, pageId }) => {
            const page = this.getState().pageCollection[pageId ?? ""]
            if (page && id) {
                delete page.strokes[id]
            }
        })
        this.renderPagesWithStrokeChanges(strokes)
    }

    /**
     * Rerender all pages which have changed content
     * @param strokes stroke updates which could require a content render
     */
    private renderPagesWithStrokeChanges(
        strokes: Stroke[] | StrokeUpdate[]
    ): void {
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

    /**
     * Add pages
     * @param addPageData pages and respective indices to be added
     */
    private addPages(addPageData: AddPageData[]): void {
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

    /**
     * Delete pages
     * @param pageIds ids of pages which should be deleted
     */
    private deletePages(pageIds: PageId[]): void {
        const { pageRank, pageCollection } = this.getState()
        pageIds.forEach((pid) => {
            pageRank.splice(pageRank.indexOf(pid), 1)
            delete pageCollection[pid]
        })

        // Make sure that transform is cleared when page is deleted
        this.clearTransform()
        subscriptionState.render("RenderNG", "EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
    }

    /**
     * Clear pages
     * @param pageIds ids of pages which should be cleared
     */
    private clearPages(pageIds: PageId[]): void {
        pageIds.forEach((pageId) => {
            this.getState().pageCollection[pageId]?.clear()
            subscriptionState.renderPageLayer("content", pageId)
        })
        subscriptionState.render("EditMenu", "MenuPageButton")
        this.saveToLocalStorage()
    }

    /**
     * Update meta info of pages
     * @param pages array which contains pages with their meta and pageId
     */
    private updatePages(pages: Pick<Page, "pageId" | "meta">[]): void {
        pages.forEach((page) => {
            this.getState().pageCollection[page.pageId]?.updateMeta(page.meta)
        })
        subscriptionState.render("RenderNG", "EditMenu")
        this.saveToLocalStorage()
    }

    /**
     * Reset the redoStack where otherwise a parallel timeline would be created
     * @param isRedoable
     */
    private clearRedoCheck(isRedoable?: boolean): void {
        if (isRedoable) {
            this.state.redoStack = []
            subscriptionState.render("EditMenu")
        }
    }
}

export const board = new Board()
