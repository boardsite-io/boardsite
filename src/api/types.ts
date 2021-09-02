import { PageMeta } from "../types"

// api
export const API_URL = process.env.REACT_APP_B_API_URL as string

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
