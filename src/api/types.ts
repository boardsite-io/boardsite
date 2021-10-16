import { PageMeta } from "redux/board/board.types"

// api
export const API_URL = process.env.REACT_APP_B_API_URL as string

export interface User {
    id: string
    alias: string
    color: string
}

export type MessageType =
    | "stroke"
    | "userconn"
    | "userdisc"
    | "pagesync"
    | "pageupdate"

interface Messages {
    [x: string]: MessageType
}
export const messages = {
    Stroke: "stroke",
    UserConnected: "userconn",
    UserDisconnected: "userdisc",
    PageSync: "pagesync",
    PageUpdate: "pageupdate",
} as Messages

export interface Message<T> {
    type: MessageType
    sender: string
    content: T
}

export interface ResponsePostSession {
    sessionId: string
}

export interface ResponsePageSync {
    pageRank: string[]
    meta: {
        [pid: string]: PageMeta
    }
}

export interface ResponsePageUpdate {
    pageId: string[]
    meta: {
        [pid: string]: PageMeta
    }
    clear: boolean
}

export interface ResponsePostAttachment {
    attachId: string
}
