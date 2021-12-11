import {
    Point,
    Stroke,
    StrokeMap,
    StrokeUpdate,
} from "drawing/stroke/stroke.types"

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

export interface Page {
    pageId: string
    strokes: StrokeMap
    meta: PageMeta

    setID: (pageId: string) => Page
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
