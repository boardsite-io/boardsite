import axios, { AxiosRequestHeaders, Method } from "axios"
import { Page, PageId, PageMeta } from "state/board/state/index.types"
import { SessionConfig, User } from "state/online/state/index.types"
import {
    PageSync,
    ResponsePostSession,
    ResponsePostAttachment,
    ResponseGetConfig,
    UpdateUserRequest,
    CreateUserRequest, RequestPostSession,
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
    baseURL = `${API_URL}/b`
    sessionId?: string
    userId?: string
    token?: string
    timeout = 3000

    jsonRequest = axios.create({
        baseURL: this.baseURL.toString(),
        transformRequest: [(data) => JSON.stringify(data) ?? ""], // for routes we dont need message type
        transformResponse: [Request.transformResponse],
        timeout: this.timeout,
    })
    fileRequest = axios.create({
        baseURL: this.baseURL.toString(),
        transformResponse: [Request.transformResponse],
        timeout: this.timeout,
    })
    pdfRequest = axios.create({
        baseURL: this.baseURL.toString(),
        timeout: this.timeout,
        responseType: "arraybuffer",
    })

    static transformResponse(data: string) {
        try {
            return JSON.parse(data)
        } catch {
            return data
        }
    }

    setSessionId(sessionId?: string) {
        this.sessionId = sessionId
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

    postSession(config?: SessionConfig): Promise<ResponsePostSession> {
        const payload: RequestPostSession = {
            config,
        }
        return this.jsonSend("POST", "/create", false, payload)
    }

    async postUser(
        user: Pick<User, "alias" | "color">,
        password?: string
    ): Promise<User> {
        const payload: CreateUserRequest = {
            password,
            user,
        }
        const userResp: User = await this.jsonSend(
            "POST",
            `${this.sessionId}/users`,
            false,
            payload
        )
        this.userId = userResp.id
        return userResp
    }

    async putUser(updatedUser: User): Promise<void> {
        const payload: UpdateUserRequest = {
            user: updatedUser,
        }
        return this.jsonSend("PUT", `${this.sessionId}/users`, true, payload)
    }

    async putKickUser(secret: string, userId: string): Promise<void> {
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
            strokes: pages.reduce(
                (obj, page) => ({ ...obj, [page.pageId]: page.strokes }),
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

export const request = new Request()
