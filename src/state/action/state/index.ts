import { getVerifiedPageIds, getVerifiedPages } from "drawing/helpers"
import { BoardPage } from "drawing/page"
import { Stroke, Tool } from "drawing/stroke/index.types"
import { cloneDeep, pick } from "lodash"
import { board } from "state/board"
import {
    AddPageData,
    Page,
    PageId,
    PageMeta,
    Paper,
} from "state/board/state/index.types"
import { drawing } from "state/drawing"
import { menu } from "state/menu"
import { notification } from "state/notification"
import { online } from "state/online"
import { subscriptionState } from "state/subscription"
import { GlobalState } from "state/types"
import { view } from "state/view"
import { ActionState, StackAction } from "./index.types"

export class Action implements GlobalState<ActionState> {
    state: ActionState = {
        redoStack: [],
        undoStack: [],
    }

    getState(): ActionState {
        return this.state
    }

    setState(newState: ActionState) {
        this.state = newState
        return this
    }

    /**
     * Clear undo and redo stack
     */
    clearUndoRedo(): void {
        this.state.undoStack = []
        this.state.redoStack = []
        subscriptionState.render("EditMenu")
    }

    undo(): void {
        board.clearTransform()
        const action = this.state.undoStack.pop()
        if (!action) return
        action.handler()
        this.state.redoStack.push({
            handler: action.undoHandler,
            undoHandler: action.handler,
        })
        subscriptionState.render("RenderNG", "EditMenu")
    }

    redo(): void {
        board.clearTransform()
        const action = this.state.redoStack.pop()
        if (!action) return
        action.handler()
        this.state.undoStack.push({
            handler: action.undoHandler,
            undoHandler: action.handler,
        })
        subscriptionState.render("RenderNG", "EditMenu")
    }

    triggerAction(action: StackAction): void {
        if (online.isConnected() && online.isReadOnly()) {
            notification.create("Notification.Session.ReadOnly", 3000)
            return
        }

        action.handler()
        this.state.undoStack.push({
            handler: action.undoHandler,
            undoHandler: action.handler,
        })
        this.state.redoStack = []
        subscriptionState.render("RenderNG", "EditMenu")
    }

    addStrokes(strokes: Stroke[]): void {
        strokes.sort((a, b) => ((a.id ?? "") > (b.id ?? "") ? 1 : -1))

        const handler = () => {
            board.addOrUpdateStrokes(strokes)
            if (online.isConnected()) {
                online.sendStrokes(strokes)
            }
        }

        const undoHandler = () => {
            board.deleteStrokes(strokes)
            if (online.isConnected()) {
                online.eraseStrokes(strokes)
            }
        }

        this.triggerAction({ handler, undoHandler })
    }

    updateStrokes(strokes: Stroke[]): void {
        const strokesCurrent = strokes.map((stroke) =>
            cloneDeep(
                board.getState().pageCollection[stroke.pageId]?.strokes[
                    stroke.id
                ]
            )
        )

        const handler = () => {
            board.addOrUpdateStrokes(strokes)
            if (online.isConnected()) {
                online.sendStrokes(strokes)
            }
        }

        const undoHandler = () => {
            board.addOrUpdateStrokes(strokesCurrent)
            if (online.isConnected()) {
                online.sendStrokes(strokesCurrent)
            }
        }

        this.triggerAction({ handler, undoHandler })
    }

    deleteStrokes(strokes: Stroke[]): void {
        const handler = () => {
            board.deleteStrokes(strokes)
            if (online.isConnected()) {
                online.eraseStrokes(strokes)
            }
        }

        const undoHandler = () => {
            board.addOrUpdateStrokes(strokes)
            if (online.isConnected()) {
                online.sendStrokes(strokes)
            }
        }

        this.triggerAction({ handler, undoHandler })
    }

    addPage(index: number): void {
        const page = new BoardPage()

        const handler = () => {
            board.addPages([{ page, index }])
            if (online.isConnected()) {
                online.addPages([page], [index])
            }
        }

        const undoHandler = () => {
            board.deletePages([page.pageId])
            if (online.isConnected()) {
                online.deletePages([page.pageId])
            }
        }

        this.triggerAction({ handler, undoHandler })
    }

    updatePages(pageUpdates: Pick<Page, "pageId" | "meta">[]): void {
        // make a copy of old page meta
        const pagesCurrent = pageUpdates.map((page) =>
            cloneDeep(
                pick(board.getState().pageCollection[page.pageId], [
                    "pageId",
                    "meta",
                ])
            )
        ) as Page[]

        const handler = () => {
            board.updatePages(pageUpdates)
            if (online.isConnected()) {
                online.updatePages(pageUpdates, false)
            }
        }

        const undoHandler = () => {
            board.updatePages(pagesCurrent)
            if (online.isConnected()) {
                online.updatePages(pagesCurrent, false)
            }
        }

        this.triggerAction({ handler, undoHandler })
    }

    clearPages(pageIds: PageId[]): void {
        const verifiedPageIds = getVerifiedPageIds(pageIds)
        const verifiedPages = getVerifiedPages(pageIds)

        const strokesCurrent = pageIds
            .map((pid) => cloneDeep(board.getState().pageCollection[pid]))
            .filter((page) => page !== undefined)
            .reduce<Stroke[]>(
                (arr, page) =>
                    arr.concat(Object.values((page as Page).strokes)),
                []
            )

        const handler = () => {
            board.clearPages(verifiedPageIds)
            if (online.isConnected()) {
                online.updatePages(verifiedPages, true)
            }
        }

        const undoHandler = () => {
            board.addOrUpdateStrokes(strokesCurrent)
            if (online.isConnected()) {
                online.sendStrokes(strokesCurrent)
            }
        }

        this.triggerAction({ handler, undoHandler })
    }

    deletePages(pageIds: PageId[]): void {
        const pagesCurrent = pageIds
            .map<AddPageData>((pid) => ({
                page: cloneDeep(board.getState().pageCollection[pid] as Page),
            }))
            .filter(({ page }) => page !== undefined)
        const pageRankCurrent = board.getState().pageRank.slice()

        const handler = () => {
            board.deletePages(pageIds)
            if (online.isConnected()) {
                online.deletePages(pageIds)
            }
        }

        const undoHandler = () => {
            // set pagerank manually as it was before deletion
            board.getState().pageRank = pageRankCurrent
            board.addPages(pagesCurrent)
            if (online.isConnected()) {
                const pages = pagesCurrent.map(({ page }) => page)
                const indices = pageIds.map((pid) =>
                    board.getState().pageRank.indexOf(pid)
                )
                // TODO: send pagerank
                online.addPages(pages, indices as number[])
            }
        }

        this.triggerAction({ handler, undoHandler })
    }

    addPageOver = (): void => {
        this.addPage(view.getPageIndex())
        view.resetView()
    }

    addPageUnder(): void {
        this.addPage(view.getPageIndex() + 1)
        view.jumpToNextPage()
        view.resetView()
    }

    clearPage(): void {
        this.clearPages([board.getPageId(view.getPageIndex())])
    }

    deleteCurrentPage(): void {
        const currentPageId = board.getPageId(view.getPageIndex())
        this.deletePages([currentPageId])
    }

    deleteAllPages(): void {
        this.deletePages(board.getState().pageRank.slice())
    }

    setTool(tool: Partial<Tool>): void {
        drawing.setTool(tool)
        board.clearTransform()
        this.clearActiveTextfield()
    }

    clearActiveTextfield = () => {
        const { activeTextfield } = board.getState()
        if (activeTextfield?.textfield?.text) {
            // Add back stroke which is being edited before clearing
            this.addStrokes([cloneDeep(activeTextfield)])
        }
        board.clearActiveTextfield()
    }

    newWorkspace(): void {
        this.deleteAllPages()
        this.addPageUnder()
        view.validatePageIndex()
        menu.closeMainMenu()
    }

    applyPageBackground(): void {
        // update the default page type
        const currentPage = board.getPage(view.getPageIndex())
        // there is no current page, eg. when all pages have been removed
        if (!currentPage) {
            return
        }
        // cannot update background of doc type
        if (currentPage.meta.background.paper === Paper.Doc) {
            return
        }

        const newMeta = cloneDeep<PageMeta>(currentPage.meta)
        newMeta.background.paper = drawing.getState().pageMeta.background.paper

        const pageUpdate = {
            pageId: currentPage.pageId,
            meta: newMeta,
        }

        this.updatePages([pageUpdate])
    }
}

export const action = new Action()
