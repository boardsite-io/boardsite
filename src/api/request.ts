import axios, { AxiosRequestConfig } from "axios"
import { Stroke } from "drawing/stroke/index.types"
import { Page } from "redux/board/board.types"
import { User } from "redux/session/session.types"
import store from "redux/store"
import {
    ResponsePageSync,
    ResponsePostSession,
    ResponsePostAttachment,
} from "./types"

const apiRequest = axios.create({
    transformRequest: [(data) => JSON.stringify(data) ?? ""], // for routes we dont need message type
    transformResponse: [
        (data) => {
            try {
                return JSON.parse(data)
            } catch {
                return data
            }
        },
    ],
    headers: {
        // prettier-ignore
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    timeout: 3000,
})

const fileRequest = axios.create({
    transformResponse: [
        (data) => {
            try {
                return JSON.parse(data)
            } catch {
                return {}
            }
        },
    ],
    headers: {
        // prettier-ignore
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
    },
    timeout: 3000,
})

const pdfRequest = axios.create({
    headers: {
        // prettier-ignore
        "Accept": "application/pdf",
    },
    timeout: 3000,
})

/**
 * Send data request to API.
 */
export async function sendRequest<T>(
    url: string,
    method: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> {
    const baseURL = store.getState().session.apiURL.toString()
    const response = await apiRequest({
        url: `${baseURL}b/${url}`,
        method,
        data,
        ...config,
    } as AxiosRequestConfig)
    return response.data
}

export function postSession(): Promise<ResponsePostSession> {
    return sendRequest("create", "post")
}

export function getUsers(sessionId: string): Promise<{ [uid: string]: User }> {
    return sendRequest(`${sessionId}/users`, "get")
}

export function postUser(sessionId: string, data: User): Promise<User> {
    return sendRequest(`${sessionId}/users`, "post", data)
}

export function getPages(sessionId: string): Promise<ResponsePageSync> {
    return sendRequest(`${sessionId}/pages`, "get")
}

export function getStrokes(
    sessionId: string,
    pageId: string
): Promise<Stroke[]> {
    return sendRequest(`${sessionId}/pages/${pageId}`, "get")
}

export function postPages(
    sessionId: string,
    pages: Page[],
    pageIndex: number[]
): Promise<void> {
    return sendRequest(`${sessionId}/pages`, "post", {
        pageId: pages.map((page) => page.pageId),
        index: pageIndex,
        meta: pages.reduce(
            (obj, page) => ({ ...obj, [page.pageId]: page.meta }),
            {}
        ),
    })
}

export function putPages(
    sessionId: string,
    pages: Page[],
    clear: boolean
): Promise<void> {
    return sendRequest(`${sessionId}/pages`, "put", {
        pageId: pages.map((page) => page.pageId),
        meta: pages.reduce(
            (obj, page) => ({ ...obj, [page.pageId]: page.meta }),
            {}
        ),
        clear,
    })
}

export function deletePages(
    sessionId: string,
    pageIds: string[]
): Promise<void> {
    return sendRequest(`${sessionId}/pages`, "delete", {
        pageId: pageIds,
    })
}

export async function postAttachment(
    sessionId: string,
    file: File
): Promise<ResponsePostAttachment> {
    const formData = new FormData()
    formData.append("file", file)

    const baseURL = store.getState().session.apiURL.toString()
    const response = await fileRequest({
        url: `${baseURL}b/${sessionId}/attachments`,
        method: "POST",
        data: formData,
    } as AxiosRequestConfig)

    return response.data
}

export async function getAttachment(
    sessionId: string,
    attachId: string
): Promise<unknown> {
    const baseURL = store.getState().session.apiURL.toString()
    const response = await pdfRequest({
        url: `${baseURL}b/${sessionId}/attachments/${attachId}`,
        method: "GET",
        responseType: "arraybuffer",
    } as AxiosRequestConfig)

    return Buffer.from(response.data, "binary").toString("base64")
}
