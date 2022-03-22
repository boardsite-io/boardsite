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
    config?: SessionConfig
    user: User
    socket?: WebSocket
    users?: ConnectedUsers
    token?: string

    setToken(token: string): void
    clearToken(): void
    updateUser(user: Partial<User>): void
    getNumberOfUsers(): number
    kickUser({ id }: Pick<User, "id">): Promise<void>
    create(): Promise<string>
    join(copyOffline?: boolean): Promise<void>
    createSocket(sessionId: string, password?: string): Promise<void>
    isConnected(): boolean
    isHost(): boolean
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
    updateConfig(config: Partial<SessionConfig>): Promise<void>
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

export enum MessageType {
    Error = "error",
    Stroke = "stroke",
    UserHost = "userhost",
    UserConnected = "userconn",
    UserSync = "usersync",
    UserDisconnected = "userdisc",
    UserKick = "userkick",
    PageSync = "pagesync",
    PageUpdate = "pageupdate",
    Config = "config",
}

export interface Message<T> {
    type: MessageType
    sender: string
    content: T
}

export interface ResponsePostSession {
    config: SessionConfig
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

export interface UserHost {
    secret: string
}

export interface ConfigMessage {
    config: SessionConfig
}

export interface ResponsePostAttachment {
    attachId: string
}

export interface ResponseGetConfig {
    users: Record<string, User>
    config: SessionConfig
}

export type SessionConfig = {
    id: string
    host: string
    maxUsers: number
    readOnly: boolean
}

export type UpdateUserRequest = {
    user: User
}

export type CreateUserRequest = {
    password?: string
    user: Pick<User, "alias" | "color">
}
