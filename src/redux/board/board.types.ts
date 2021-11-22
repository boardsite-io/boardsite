import { Point, Stroke, StrokeMap, StrokeUpdate } from "drawing/stroke/types"

export type SerializedBoardState = BoardState & { version?: string }
export interface BoardState {
    currentPageIndex: number
    pageRank: string[]
    pageCollection: PageCollection
    documentImages: string[]
    documentSrc: URL | string | Uint8Array
    pageSettings: PageSettings
    view: BoardView
    undoStack?: BoardAction[]
    redoStack?: BoardAction[]
    strokeUpdates?: StrokeUpdate[]
    transformStrokes?: TransformStrokes
    transformPagePosition?: Point
    renderTrigger?: number

    triggerManualUpdate?(): void

    serialize?(): SerializedBoardState
    deserialize?(parsed: SerializedBoardState): BoardState
}

export interface BoardView {
    keepCentered: boolean
    hideNavBar: boolean
    stageWidth: number
    stageHeight: number
    stageX: number
    stageY: number
    stageScale: Point
}

export interface BoardAction {
    handleFunc: (boardState: BoardState) => void
    undoHandleFunc: (boardState: BoardState) => void
}

export interface StrokeAction {
    strokes: Stroke[] | StrokeUpdate[]
    isRedoable?: boolean
    sessionHandler?: (...updates: Stroke[] | StrokeUpdate[]) => void
    sessionUndoHandler?: (...updates: Stroke[] | StrokeUpdate[]) => void
}

export type TransformStrokes = Stroke[]

export interface PageSettings {
    background: PageBackgroundStyle
    size: PageSize
}

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
export interface PageMeta extends PageSize {
    background: {
        style: PageBackgroundStyle
        attachURL: URL | string
        documentPageNum: number
    }
}

export type PageBackgroundStyle = "blank" | "checkered" | "ruled" | "doc"
