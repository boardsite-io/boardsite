import { BoardPage } from "drawing/page"
import {
    SerializedStroke,
    Stroke,
    StrokeUpdate,
} from "drawing/stroke/index.types"
import {
    Page,
    PageCollection,
    PageId,
    PageMeta,
    PageRank,
} from "state/board/state/index.types"

export interface Session {
    id?: string
    user: User
    socket?: WebSocket
    users?: ConnectedUsers
    token?: string

    setToken(token: string): void
    updateUser(user: Partial<User>): void
    setID(sessionId: string): Session
    create(): Promise<string>
    join(copyOffline?: boolean): Promise<void>
    createSocket(sessionId: string): Promise<void>
    isConnected(): boolean
    disconnect(): void
    synchronize(
        pageRank: PageId[],
        pageCollection: PageCollection
    ): Promise<void>
    send(type: MessageType, content: unknown): void
    sendStrokes(strokes: Stroke[] | StrokeUpdate[]): void
    eraseStrokes(strokes: { id: string; pageId: string }[]): void
    addPages(pages: BoardPage[], pageIndex: number[]): Promise<void>
    deletePages(pageIds: string[]): Promise<void>
    updatePages(
        pages: Pick<Page, "pageId" | "meta">[],
        clear: boolean
    ): Promise<void>
    addAttachment(file: File): Promise<string>
    getAttachment(attachId: string): Promise<Uint8Array>
    attachURL(attachId: string): URL
}

export type User = {
    id?: string
    alias: string
    color: string
}
export type ConnectedUsers = Record<string, User>

export type StrokeDelete = {
    id: string
    pageId: string
}

export type MessageType =
    | "stroke"
    | "userconn"
    | "userdisc"
    | "pagesync"
    | "pageupdate"

export const messages = {
    Stroke: "stroke" as MessageType,
    UserConnected: "userconn" as MessageType,
    UserDisconnected: "userdisc" as MessageType,
    PageSync: "pagesync" as MessageType,
    PageUpdate: "pageupdate" as MessageType,
}

export interface Message<T> {
    type: MessageType
    sender: string
    content: T
}

export interface ResponsePostSession {
    sessionId: string
}

export type SerializedPage = {
    pageId: PageId
    meta: PageMeta
    strokes?: SerializedStroke[]
}

export interface PageSync {
    pageRank: PageRank
    pages: Record<PageId, SerializedPage>
}

export interface ResponsePostAttachment {
    attachId: string
}
