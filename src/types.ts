import { Transformer } from "konva/types/shapes/Transformer"
import { Node, NodeConfig } from "konva/types/Node"
import { Stroke } from "board/stroke/types"

// eslint-disable-next-line no-shadow
export enum Variants {
    Primary = "PRIMARY",
    Secondary = "SECONDARY",
}

export interface Page {
    pageId: string
    strokes: StrokeMap
    meta: PageMeta

    setID: (pageId: string) => Page
    add: (index?: number) => void
    clear: () => void
    updateMeta: (meta: PageMeta) => Page
}

export interface StrokeMap {
    [id: string]: Stroke
}

export type DocumentImage = HTMLImageElement

export interface PageCollection {
    [pid: string]: Page
}

export interface User {
    id: string
    alias: string
    color: string
}

export type PageBackground = "blank" | "checkered" | "ruled" | "doc"
export interface PageMeta {
    background: {
        style: PageBackground
        attachId: string
        documentPageNum: number
    }
}

export type TrRefType = React.RefObject<Transformer>
export type TrNodesType = Node<NodeConfig>[]
