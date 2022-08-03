import {
    Point,
    SerializedStroke,
    Stroke,
    StrokeCollection,
    StrokeUpdate,
} from "drawing/stroke/index.types"
import { SerializedVersionState, Serializer } from "state/types"
import { StrokeId } from "../../../View/Board/RenderNG/index.types"

interface State<A extends SerializedAttachment, P extends SerializedPage> {
    pageRank: PageRank
    pageCollection: Record<PageId, P>
    attachments: Record<AttachId, A>
    undoStack?: StackAction[]
    redoStack?: StackAction[]
    strokeUpdates?: StrokeUpdate[]
    transformStrokes?: TransformStrokes
    activeTextfield?: ActiveTextfield
    transformPagePosition?: Point
}

export type BoardState = State<Attachment, Page>
export type SerializedBoardState = SerializedVersionState<
    State<SerializedAttachment, SerializedPage>
>

export type PageRank = string[]
export type RenderedData = ImageData[]

export type AttachId = string

export enum AttachType {
    PDF,
    PNG,
}

export interface SerializedAttachment {
    id: AttachId
    type: AttachType
    cachedBlob: Uint8Array
}

export interface Attachment
    extends SerializedAttachment,
        Serializer<Attachment, SerializedAttachment> {
    renderedData: RenderedData

    setId(attachId: AttachId): Attachment

    render(): Promise<Attachment>
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
export type ActiveTextfield = Stroke & { isUpdate?: boolean }

export type PageId = string

export interface SerializedPage {
    pageId: PageId
    strokes: Record<string, SerializedStroke>
    meta: PageMeta
}

export interface Page extends Serializer<Page, SerializedPage> {
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

export enum Paper {
    Blank = "blank",
    Checkered = "checkered",
    Ruled = "ruled",
    Doc = "doc",
}

export type AddPageData = {
    page: Page
    index?: number
}
export type AddStrokesAction = BoardAction<Stroke[], void[]>
export type UpdateStrokesAction = BoardAction<Stroke[], Stroke[]>
export type EraseStrokesAction = BoardAction<Stroke[], Stroke[]>
export type SoftEraseStrokesAction = BoardAction<Stroke[], void[]>
export type AddPagesAction = BoardAction<AddPageData[], void[]>
export type ClearPagesAction = BoardAction<PageId[], Stroke[]>
export type DeletePagesAction = BoardAction<PageId[], AddPageData[]>
