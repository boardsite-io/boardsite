import axios, { AxiosInstance, Method } from "axios"
import { Stroke } from "drawing/stroke/index.types"
import { Page } from "redux/board/board.types"
import {
    ResponsePageSync,
    ResponsePostSession,
    ResponsePostAttachment,
    User,
} from "./types"

export class Request {
    baseURL: string
    sessionId?: string

    timeout = 3000
    headers: Record<string, string> = {
        // prettier-ignore
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
    }

    transformResponse = (data: string) => {
        try {
            return JSON.parse(data)
        } catch {
            return data
        }
    }

    jsonRequest: AxiosInstance
    fileRequest: AxiosInstance
    pdfRequest: AxiosInstance

    constructor(baseURL: string, sessionId?: string) {
        this.baseURL = `${baseURL}b`
        this.sessionId = sessionId
        this.jsonRequest = axios.create({
            baseURL: this.baseURL.toString(),
            headers: this.headers,
            transformRequest: [(data) => JSON.stringify(data) ?? ""], // for routes we dont need message type
            transformResponse: [this.transformResponse],
            timeout: this.timeout,
        })
        this.fileRequest = axios.create({
            baseURL: this.baseURL.toString(),
            headers: this.headers,
            transformResponse: [this.transformResponse],
            timeout: this.timeout,
        })
        this.pdfRequest = axios.create({
            baseURL: this.baseURL.toString(),
            headers: {
                // prettier-ignore
                "Accept": "application/pdf",
            },
            timeout: this.timeout,
            responseType: "arraybuffer",
        })
    }

    async jsonSend<T>(method: Method, url: string, data?: unknown): Promise<T> {
        const resp = await this.jsonRequest.request({
            method,
            url,
            data,
        })
        return resp.data
    }

    postSession(): Promise<ResponsePostSession> {
        return this.jsonSend("POST", "/create")
    }

    getUsers(): Promise<Record<string, User>> {
        return this.jsonSend("GET", `${this.sessionId}/users`)
    }

    postUser(data: Partial<User>): Promise<User> {
        return this.jsonSend("POST", `${this.sessionId}/users`, data)
    }

    getPages(): Promise<ResponsePageSync> {
        return this.jsonSend("GET", `${this.sessionId}/pages`)
    }

    getStrokes(pageId: string): Promise<Stroke[]> {
        return this.jsonSend("GET", `${this.sessionId}/pages/${pageId}`)
    }

    postPages(pages: Page[], pageIndex: number[]): Promise<void> {
        return this.jsonSend("POST", `${this.sessionId}/pages`, {
            pageId: pages.map((page) => page.pageId),
            index: pageIndex,
            meta: pages.reduce(
                (obj, page) => ({ ...obj, [page.pageId]: page.meta }),
                {}
            ),
        })
    }

    putPages(
        pages: Pick<Page, "pageId" | "meta">[],
        clear: boolean
    ): Promise<void> {
        return this.jsonSend("PUT", `${this.sessionId}/pages`, {
            pageId: pages.map((page) => page.pageId),
            meta: pages.reduce(
                (obj, page) => ({ ...obj, [page.pageId]: page.meta }),
                {}
            ),
            clear,
        })
    }

    deletePages(pageIds: string[]): Promise<void> {
        return this.jsonSend("DELETE", `${this.sessionId}/pages`, {
            pageId: pageIds,
        })
    }

    async postAttachment(file: File): Promise<ResponsePostAttachment> {
        const formData = new FormData()
        formData.append("file", file)
        const response = await this.fileRequest.post(
            `${this.sessionId}/attachments`,
            formData
        )
        return response.data
    }

    async getAttachment(attachId: string): Promise<unknown> {
        const response = await this.pdfRequest.get(
            `${this.sessionId}/attachments/${attachId}`
        )
        return Buffer.from(response.data, "binary").toString("base64")
    }
}
