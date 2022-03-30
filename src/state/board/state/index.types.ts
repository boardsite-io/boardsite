import {
    Point,
    SerializedStroke,
    Stroke,
    StrokeCollection,
    StrokeUpdate,
} from "drawing/stroke/index.types"

export interface BoardState {
    currentPageIndex: number
    pageRank: PageRank
    pageCollection: PageCollection
    attachments: Attachments
    undoStack?: StackAction[]
    redoStack?: StackAction[]
    strokeUpdates?: StrokeUpdate[]
    transformStrokes?: TransformStrokes
    transformPagePosition?: Point
}

export type PageRank = string[]
export type RenderedData = ImageData[]

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
    handler: () => void
    undoHandler: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BoardAction<T extends any[], U extends any[]> {
    data: T
    isUpdate?: boolean
    isRedoable?: boolean
    sessionHandler?: <P extends T>(redos: P) => void
    sessionUndoHandler?: <V extends U>(undos: V) => void
}

export interface ActionConfig {
    handler: () => void
    undoHandler: () => void
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
    paper: Paper
    attachId?: string
    documentPageNum?: number
}

export type SetPageMetaAction = BoardAction<
    Pick<Page, "pageId" | "meta">[],
    Pick<Page, "pageId" | "meta">[]
>

export type Paper = "blank" | "checkered" | "ruled" | "doc"

export type AddPageData = {
    page: Page
    index?: number
}
export type AddStrokesAction = BoardAction<Stroke[], void[]>
export type EraseStrokesAction = BoardAction<Stroke[], void[]>
export type AddPagesAction = BoardAction<AddPageData[], void[]>
export type ClearPagesAction = BoardAction<PageId[], Stroke[]>
export type DeletePagesAction = BoardAction<PageId[], AddPageData[]>
