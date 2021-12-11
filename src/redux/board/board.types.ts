import {
    Point,
    Stroke,
    StrokeMap,
    StrokeUpdate,
} from "drawing/stroke/index.types"

export type SerializedBoardState = BoardState & { version?: string }
export interface BoardState {
    currentPageIndex: number
    pageRank: PageRank
    pageCollection: PageCollection
    pageMeta: PageMeta
    documentImages: DocumentImages
    documentSrc: DocumentSrc
    stage: BoardStage
    undoStack?: BoardAction[]
    redoStack?: BoardAction[]
    strokeUpdates?: StrokeUpdate[]
    transformStrokes?: TransformStrokes
    transformPagePosition?: Point
    renderTrigger?: number

    triggerManualUpdate?(): void

    serialize?(): SerializedBoardState
    deserialize?(parsed: SerializedBoardState): Promise<BoardState>
}

export type StageAttrs = {
    width: number
    height: number
    x: number
    y: number
    scaleX: number
    scaleY: number
}
export type PageRank = string[]
export type DocumentImages = string[]

export interface BoardStage {
    attrs: StageAttrs
    keepCentered: boolean
    hideNavBar: boolean
    renderTrigger: boolean
}

export type DocumentSrc = URL | string | Uint8Array
export interface BoardAction {
    handleFunc: (boardState: BoardState) => void
    undoHandleFunc: (boardState: BoardState) => void
}

export interface StrokeAction {
    strokes: Stroke[] | StrokeUpdate[]
    isUpdate?: boolean
    isRedoable?: boolean
    sessionHandler?: (...updates: Stroke[] | StrokeUpdate[]) => void
    sessionUndoHandler?: (...updates: Stroke[] | StrokeUpdate[]) => void
}

export type TransformStrokes = Stroke[]

export type PageId = string
export interface Page {
    pageId: PageId
    strokes: StrokeMap
    meta: PageMeta

    setID: (pageId: PageId) => Page
    clear: () => void
    updateMeta: (meta: PageMeta) => Page
}

export type PageCollection = Record<string, Page>

export interface PageSize {
    width: number
    height: number
}
export interface PageMeta {
    size: PageSize
    background: {
        style: PageBackgroundStyle
        attachURL?: URL | string
        documentPageNum?: number
    }
}

export type PageBackgroundStyle = "blank" | "checkered" | "ruled" | "doc"

/* ------- Reducer Action Types ------- */
export type LoadBoardState = BoardState
export type SyncAllPages = {
    pageRank: PageRank
    pageCollection: PageCollection
}
export type SetPageRank = {
    pageRank: PageRank
    pageCollection: PageCollection
}
export type SetPageMeta = {
    pageId: PageId
    meta: PageMeta
}
export type SetPageBackground = PageBackgroundStyle
export type SetPageSize = PageSize
export type AddPage = {
    page: Page
    index: number
}
export type ClearPage = PageId
export type DeletePages = PageId[]
export type MoveShapesToDragLayer = {
    strokes: Stroke[]
    pagePosition?: Point
}
export type AddStrokes = StrokeAction
export type EraseStrokes = StrokeAction
export type SetPdf = {
    documentImages: DocumentImages
    documentSrc: DocumentSrc
}
export type NextPage = { attrs: StageAttrs }
export type PrevPage = { attrs: StageAttrs }
export type JumpToPageWithIndex = number
export type SetStageAttrs = StageAttrs
