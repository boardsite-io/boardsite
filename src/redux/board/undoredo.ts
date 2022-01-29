import { BoardStroke } from "drawing/stroke"
import { Stroke, StrokeUpdate } from "drawing/stroke/index.types"
import {
    BoardState,
    ActionConfig,
    PageId,
    AddPageData,
    Page,
} from "./index.types"

export function undoAction(state: BoardState): void {
    const action = state.undoStack?.pop()
    if (action) {
        addAction({
            handler: action.handler,
            undoHandler: action.undoHandler,
            stack: state.redoStack,
            isRedoable: true,
            state,
        })
    }
}

export function redoAction(state: BoardState): void {
    const action = state.redoStack?.pop()
    if (action) {
        addAction({
            handler: action.handler,
            undoHandler: action.undoHandler,
            stack: state.undoStack,
            isRedoable: true,
            state,
        })
    }
}

export function addAction(cfg: ActionConfig): void {
    if (cfg.isRedoable) {
        cfg.stack = cfg.stack ?? []
        cfg.stack?.push({
            handler: cfg.undoHandler,
            undoHandler: cfg.handler,
        })

        if (cfg.isNew) {
            cfg.state.redoStack = []
        }
    }

    cfg.handler(cfg.state)
}

export function deleteStrokes(
    state: BoardState,
    ...strokes: Stroke[] | StrokeUpdate[]
): void {
    strokes.forEach(({ id, pageId }) => {
        const page = state.pageCollection[pageId ?? ""]
        if (page && id) {
            delete page.strokes[id]
        }
    })
}

export function addOrUpdateStrokes(
    state: BoardState,
    ...strokes: Stroke[] | StrokeUpdate[]
): void {
    strokes.forEach((stroke) => {
        const page = state.pageCollection[stroke.pageId ?? ""]
        if (page && stroke.id) {
            if (page.strokes[stroke.id]) {
                // stroke exists -> update
                page.strokes[stroke.id].update(stroke)
            } else {
                page.strokes[stroke.id] = new BoardStroke(stroke as Stroke)
            }
        }
    })
}

export function addPages(
    state: BoardState,
    ...addPageData: AddPageData[]
): void {
    addPageData.forEach(({ page, index }) => {
        state.pageCollection[page.pageId] = page
        if (index !== undefined) {
            if (index >= 0) {
                state.pageRank.splice(index, 0, page.pageId)
            } else {
                state.pageRank.push(page.pageId)
            }
        }
    })
}

export function deletePages(state: BoardState, ...pageIds: PageId[]): void {
    pageIds.forEach((pid) => {
        state.pageRank.splice(state.pageRank.indexOf(pid), 1)
        delete state.pageCollection[pid]
    })
}

export function clearPages(state: BoardState, ...pageIds: PageId[]): void {
    pageIds.forEach((pid) => {
        state.pageCollection[pid]?.clear()
    })
}

export function updatePages(
    state: BoardState,
    ...pages: Pick<Page, "pageId" | "meta">[]
): void {
    pages.forEach((page) => {
        state.pageCollection[page.pageId]?.updateMeta(page.meta)
    })
}
