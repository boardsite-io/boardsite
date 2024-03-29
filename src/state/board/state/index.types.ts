import {
    Point,
    SerializedStroke,
    Stroke,
    StrokeCollection,
} from "drawing/stroke/index.types"
import { SerializedVersionState, Serializer } from "state/types"

interface State<A extends SerializedAttachment, P extends SerializedPage> {
    pageRank: PageRank
    pageCollection: Record<PageId, P>
    attachments: Record<AttachId, A>
    transformStrokes?: TransformStrokes
    activeTextfield?: ActiveTextfield
    transformPagePosition?: Point
}

export type BoardState = State<Attachment, Page>
export type SerializedBoardState = SerializedVersionState<
    State<SerializedAttachment, SerializedPage>
>

export type PageRank = string[]
export type RenderedData = Record<number, ImageData>

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
    // Loads additional information for the attachment eg. metadata
    load(): Promise<Attachment>
    // Sets the attachment
    setId(attachId: AttachId): Attachment
    // Renders the attachment
    render(): Promise<Attachment>
}

export type Attachments = Record<AttachId, Attachment>

export type DocumentSrc = string | Uint8Array

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
