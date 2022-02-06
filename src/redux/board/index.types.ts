import {
    Point,
    SerializedStroke,
    Stroke,
    StrokeCollection,
    StrokeUpdate,
} from "drawing/stroke/index.types"

export type SerializedBoardState = BoardState & { version?: string }
export interface BoardState {
    currentPageIndex: number
    pageRank: PageRank
    pageCollection: PageCollection
    attachments: Attachments
    view: View
    undoStack?: StackAction[]
    redoStack?: StackAction[]
    strokeUpdates?: StrokeUpdate[]
    transformStrokes?: TransformStrokes
    transformPagePosition?: Point
    renderTrigger?: number

    clearTransform?(): void
    triggerStageRender?(): void
    triggerStrokesRender?(): void

    serialize?(): SerializedBoardState
    deserialize?(parsed: SerializedBoardState): Promise<BoardState>
}

export type PageRank = string[]
export type RenderedData = ImageData[]

export interface View {
    keepCentered: boolean
    renderTrigger: boolean
}

export type AttachId = string

export enum AttachType {
    PDF,
    PNG,
}
export interface Attachment {
    id: AttachId
    type: AttachType
    renderedData: RenderedData
    cachedBlob: Uint8Array

    setId(attachId: AttachId): Attachment
    render(): Promise<Attachment>
    serialize(): void
    deserialize(): Promise<Attachment>
}

export type Attachments = Record<AttachId, Attachment>

export type DocumentSrc = string | Uint8Array
export interface StackAction {
    handler: (boardState: BoardState) => void
    undoHandler: (boardState: BoardState) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BoardAction<T extends any[], U extends any[]> {
    data: T
    isUpdate?: boolean
    isRedoable?: boolean
    sessionHandler?: (...redos: T) => void
    sessionUndoHandler?: (...undos: U) => void
}

export interface ActionConfig {
    handler: (boardState: BoardState) => void
    undoHandler: (boardState: BoardState) => void
    state: BoardState
    stack?: StackAction[]
    isRedoable?: boolean
    isNew?: boolean
}

export type TransformStrokes = Stroke[]

export type PageId = string
export interface Page {
    pageId: PageId
    strokes: StrokeCollection
    meta: PageMeta

    setID: (pageId: PageId) => Page
    clear: () => void
    updateMeta: (meta: PageMeta) => Page
    addStrokes: (strokes: (Stroke | SerializedStroke)[]) => Page
}

export type PageCollection = Record<PageId, Page>

export interface PageSize {
    width: number
    height: number
}
export interface PageMeta {
    size: PageSize
    background: PageBackground
}
export interface PageBackground {
    style: PageBackgroundStyle
    attachId?: string
    documentPageNum?: number
}

export type PageBackgroundStyle = "blank" | "checkered" | "ruled" | "doc"

/* ------- Reducer Action Types ------- */
export type LoadBoardState = BoardState
export type SyncPages = {
    pageRank: PageRank
    pageCollection: PageCollection
}
export type SetPageMeta = BoardAction<
    Pick<Page, "pageId" | "meta">[],
    Pick<Page, "pageId" | "meta">[]
>
export type AddPageData = {
    page: Page
    index?: number
}
export type AddPages = BoardAction<AddPageData[], void[]>
export type ClearPages = BoardAction<PageId[], Stroke[]>
export type DeletePages = BoardAction<PageId[], AddPageData[]>
export type MoveShapesToDragLayer = {
    strokes: Stroke[]
    pagePosition?: Point
}
export type AddStrokes = BoardAction<Stroke[], void[]>
export type EraseStrokes = BoardAction<Stroke[], void[]>

export type AddAttachments = Attachment[]
export type DeleteAttachments = AttachId[]
export type JumpToPageWithIndex = number
