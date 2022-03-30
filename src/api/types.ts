import { SerializedStroke } from "drawing/stroke/index.types"
import { PageId, PageMeta, PageRank } from "state/board/state/index.types"
import { SessionConfig, User } from "state/online/state/index.types"

export enum ErrorCode {
    BadRequest = 4000,
    RateLimitExceeded = 4001,
    MissingIdentifier = 4002,
    AttachmentSizeExceeded = 4003,
    MaxNumberOfUsersReached = 4004,
    BadUsername = 4005,
    InvalidPassword = 4006,
}

type ErrorResponse = {
    data: {
        code: ErrorCode
        message: string
    }
}

export type ErrorBody = {
    response?: ErrorResponse
}

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

export interface RequestPostSession {
    config?: Partial<SessionConfig>
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

export type UpdateUserRequest = {
    user: User
}

export type CreateUserRequest = {
    password?: string
    user: Pick<User, "alias" | "color">
}
