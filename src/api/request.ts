import axios, { AxiosRequestConfig } from "axios"
import { BoardPage } from "../drawing/page"
import store from "../redux/store"
import { Stroke, User } from "../types"
import { ResponsePageSync } from "./types"

const apiRequest = axios.create({
    transformRequest: [(data) => JSON.stringify({ content: data })], // for routes we dont need message type
    transformResponse: [
        (data) => {
            try {
                return JSON.parse(data).content // only need content
            } catch {
                return {}
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
                return JSON.parse(data).content // only need content
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

/**
 * Send data request to API.
 */
export async function sendRequest<T>(
    url: string,
    method: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> {
    const baseURL = store.getState().webControl.apiURL.toString()
    const response = await apiRequest({
        url: `${baseURL}b/${url}`,
        method,
        data,
        ...config,
    } as AxiosRequestConfig)
    return response.data
}

export function postSession(): Promise<string> {
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
    pages: BoardPage[],
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
    pages: BoardPage[],
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

export function deletePage(sessionId: string, pageId: string): Promise<void> {
    return sendRequest(`${sessionId}/pages/${pageId}`, "delete")
}

export async function postAttachement(
    sessionId: string,
    file: File
): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)

    const baseURL = store.getState().webControl.apiURL.toString()
    const response = await fileRequest({
        url: `${baseURL}b/${sessionId}/attachments`,
        method: "POST",
        data: formData,
    } as AxiosRequestConfig)

    return response.data
}
