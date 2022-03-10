import axios, { AxiosInstance, AxiosRequestHeaders, Method } from "axios"
import { Page, PageId, PageMeta } from "state/board/state/index.types"
import {
    PageSync,
    ResponsePostSession,
    ResponsePostAttachment,
    User,
    ResponseGetConfig,
    SessionConfig,
} from "./types"

export const API_URL = process.env.REACT_APP_B_API_URL as string

const HEADER_USER_ID = "Boardsite-User-Id"
const HEADER_SESSION_SECRET = "Boardsite-Session-Secret"

enum PageQueryParam {
    clear = "clear",
    delete = "delete",
    meta = "meta",
}

export class Request {
    baseURL: string
    sessionId?: string
    userId?: string
    token?: string

    timeout = 3000

    jsonRequest: AxiosInstance
    fileRequest: AxiosInstance
    pdfRequest: AxiosInstance
    transformResponse: (data: string) => string

    constructor(sessionId?: string) {
        this.baseURL = `${API_URL}/b`
        this.sessionId = sessionId
        this.transformResponse = (data) => {
            try {
                return JSON.parse(data)
            } catch {
                return data
            }
        }
        this.jsonRequest = axios.create({
            baseURL: this.baseURL.toString(),
            transformRequest: [(data) => JSON.stringify(data) ?? ""], // for routes we dont need message type
            transformResponse: [this.transformResponse],
            timeout: this.timeout,
        })
        this.fileRequest = axios.create({
            baseURL: this.baseURL.toString(),
            transformResponse: [this.transformResponse],
            timeout: this.timeout,
        })
        this.pdfRequest = axios.create({
            baseURL: this.baseURL.toString(),
            timeout: this.timeout,
            responseType: "arraybuffer",
        })
    }

    getHeaders(useUserValidation?: boolean): AxiosRequestHeaders {
        const headers: AxiosRequestHeaders = {
            "Content-Type": "application/json",
        }
        if (useUserValidation) {
            headers[HEADER_USER_ID] = this.userId ?? ""
        }
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`
        }
        return headers
    }

    async jsonSend<T>(
        method: Method,
        url: string,
        useUserValidation?: boolean,
        data?: unknown
    ): Promise<T> {
        const resp = await this.jsonRequest.request({
            method,
            url,
            data,
            headers: this.getHeaders(useUserValidation),
        })
        return resp.data
    }

    postSession(): Promise<ResponsePostSession> {
        return this.jsonSend("POST", "/create")
    }

    async postUser(data: Partial<User>): Promise<User> {
        const user: User = await this.jsonSend(
            "POST",
            `${this.sessionId}/users`,
            false,
            data
        )
        this.userId = user.id
        return user
    }

    async putUser(secret: string, userId: string): Promise<void> {
        const headers = {
            ...this.getHeaders(true),
            [HEADER_SESSION_SECRET]: secret,
        }
        await this.jsonRequest.request({
            method: "PUT",
            url: `${this.sessionId}/users/${userId}`,
            headers,
        })
    }

    getConfig(): Promise<ResponseGetConfig> {
        return this.jsonSend("GET", `${this.sessionId}/config`, true)
    }

    async putConfig(
        secret: string,
        config: Partial<SessionConfig>
    ): Promise<void> {
        const headers = {
            ...this.getHeaders(true),
            [HEADER_SESSION_SECRET]: secret,
        }
        await this.jsonRequest.request({
            method: "PUT",
            url: `${this.sessionId}/config`,
            data: config,
            headers,
        })
    }

    getPageRank(): Promise<PageId[]> {
        return this.jsonSend("GET", `${this.sessionId}/pages`, true)
    }

    getPage(pageId: string): Promise<Page> {
        return this.jsonSend("GET", `${this.sessionId}/pages/${pageId}`, true)
    }

    postPages(pages: Page[], pageIndex: number[]): Promise<void> {
        return this.jsonSend("POST", `${this.sessionId}/pages`, true, {
            pageId: pages.map((page) => page.pageId),
            index: pageIndex,
            meta: pages.reduce(
                (obj, page) => ({ ...obj, [page.pageId]: page.meta }),
                {}
            ),
        })
    }

    updatePagesMeta(meta: Record<PageId, PageMeta>): Promise<void> {
        return this.jsonSend(
            "PUT",
            `${this.sessionId}/pages?update=${PageQueryParam.meta}`,
            true,
            { meta }
        )
    }

    clearPages(pageIds: string[]): Promise<void> {
        return this.jsonSend(
            "PUT",
            `${this.sessionId}/pages?update=${PageQueryParam.clear}`,
            true,
            { pageId: pageIds }
        )
    }

    deletePages(pageIds: string[]): Promise<void> {
        return this.jsonSend(
            "PUT",
            `${this.sessionId}/pages?update=${PageQueryParam.delete}`,
            true,
            { pageId: pageIds }
        )
    }

    getPagesSync(): Promise<PageSync> {
        return this.jsonSend("GET", `${this.sessionId}/pages/sync`, true)
    }

    postPagesSync(sync: PageSync): Promise<void> {
        return this.jsonSend("POST", `${this.sessionId}/pages/sync`, true, sync)
    }

    async postAttachment(file: File): Promise<ResponsePostAttachment> {
        const formData = new FormData()
        formData.append("file", file)
        const headers = this.getHeaders(true)
        headers["Content-Type"] = "multipart/form-data"
        const response = await this.fileRequest.post(
            `${this.sessionId}/attachments`,
            formData,
            { headers }
        )
        return response.data
    }

    async getAttachment(attachId: string): Promise<Uint8Array> {
        const headers = this.getHeaders(true)
        headers.Accept = "application/pdf"
        const response = await this.pdfRequest.get(
            `${this.sessionId}/attachments/${attachId}`,
            { headers }
        )
        return response.data
    }
}
