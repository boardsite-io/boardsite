import { BoardStroke } from "drawing/stroke"
import { Stroke, Textfield } from "drawing/stroke/index.types"
import { subscriptionState } from "state/subscription"
import { GlobalState } from "state/types"
import { assign, cloneDeep, keys, pick } from "lodash"
import { PAGE_SIZE } from "consts"
import { PageIndex } from "state/view/state/index.types"
import { getDefaultBoardState } from "./default"
import {
    AddPageData,
    AttachId,
    Attachment,
    BoardState,
    Page,
    PageCollection,
    PageRank,
    PageId,
    PageSize,
    ActiveTextfield,
    TransformStrokes,
} from "./index.types"
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
     * Clear shape transformer
     */
    clearTransform(): void {
        this.state.transformStrokes = []
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
    setTransformStrokes(strokes: TransformStrokes, pageId: PageId): void {
        this.clearTransform()
        this.state.transformStrokes = cloneDeep(strokes) // clone to prevent transform view to be erased
        subscriptionState.pageSubscribers[pageId]?.transformer?.({})
    }

    setActiveTextfield(activeTextfield: ActiveTextfield): void {
        // clone to prevent the text from being edited in-place
        this.state.activeTextfield = cloneDeep(activeTextfield)

        if (!activeTextfield.textfield) {
            this.state.activeTextfield.textfield = {
                text: "",
                color: "#000000",
                hAlign: "left",
                vAlign: "top",
                font: "Lato, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 20,
            }
        }

        subscriptionState.render("Textfield")
    }

    setTextareaAttributes(textfield: Textfield) {
        if (this.state.activeTextfield) {
            this.state.activeTextfield.textfield = textfield
            subscriptionState.render("Textfield")
        }
    }

    clearActiveTextfield(): void {
        delete this.state.activeTextfield
        subscriptionState.render("Textfield")
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

    hideStrokes(strokes: Stroke[]): void {
        strokes.forEach((stroke) => {
            this.state.pageCollection[stroke.pageId].strokes[
                stroke.id
            ].isHidden = true
        })

        this.renderPagesWithStrokeChanges(strokes, true)
    }

    /**
     * Add or update strokes
     * @param strokes new strokes or stroke updates
     */
    addOrUpdateStrokes(strokes: Stroke[]): void {
        strokes.forEach((stroke) => {
            const page = this.getState().pageCollection[stroke.pageId]
            stroke.isHidden = false
            if (page && stroke.id) {
                if (page.strokes[stroke.id]) {
                    // stroke exists -> update
                    page.strokes[stroke.id].update(stroke)
                } else {
                    page.strokes[stroke.id] = new BoardStroke(stroke)
                }
            }
        })
        this.renderPagesWithStrokeChanges(strokes)
    }

    /**
     * Delete strokes
     * @param strokes strokes to be deleted
     */
    deleteStrokes(strokes: Stroke[]): void {
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
        strokes: Stroke[],
        skipLocalStorage?: boolean
    ): void {
        const renderedPages: Record<PageId, boolean> = {}
        strokes.forEach(({ pageId }) => {
            if (pageId && !renderedPages[pageId]) {
                renderedPages[pageId] = true // prevent rerendering twice
                subscriptionState.renderPageLayer("content", pageId)
            }
        })
        subscriptionState.render("EditMenu")
        if (!skipLocalStorage) {
            this.saveToLocalStorage()
        }
    }

    /**
     * Add pages
     * @param addPageData pages and respective indices to be added
     */
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

    /**
     * Delete pages
     * @param pageIds ids of pages which should be deleted
     */
    deletePages(pageIds: PageId[]): void {
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
    clearPages(pageIds: PageId[]): void {
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
    updatePages(pages: Pick<Page, "pageId" | "meta">[]): void {
        pages.forEach((page) => {
            this.getState().pageCollection[page.pageId]?.updateMeta(page.meta)
        })
        subscriptionState.render("RenderNG", "EditMenu")
        this.saveToLocalStorage()
    }
}

export const board = new Board()
