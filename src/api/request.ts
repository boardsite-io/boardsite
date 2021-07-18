import axios, { AxiosRequestConfig } from "axios"
import { BoardPage } from "../drawing/page"
import store from "../redux/store"
import { PageMeta, Stroke, User } from "../types"
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

/**
 * Send data request to API.
 */
export async function sendRequest<T>(
    url: string,
    method: string,
    data?: unknown | undefined
): Promise<T> {
    const baseURL = store.getState().webControl.apiURL.toString()
    const response = await apiRequest({
        url: `${baseURL}b/${url}`,
        method,
        data,
    } as AxiosRequestConfig)
    return response.data
}

export function createSession(): Promise<string> {
    return sendRequest("create", "post")
}

export function getUsers(sessionId: string): Promise<{ [uid: string]: User }> {
    return sendRequest(`${sessionId}/users`, "get")
}

export function createUser(sessionId: string, data: User): Promise<User> {
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

export async function addPage(
    sessionId: string,
    page: BoardPage,
    pageIndex: number
): Promise<void> {
    return sendRequest(`${sessionId}/pages`, "post", {
        pageId: page.pageId,
        index: pageIndex,
        meta: page.meta,
    })
}

export async function updatePage(
    sessionId: string,
    pageId: string,
    meta: PageMeta | undefined,
    clear: boolean
): Promise<void> {
    return sendRequest(`${sessionId}/pages/${pageId}`, "put", {
        meta,
        clear,
    })
}

export function deletePage(sessionId: string, pageId: string): Promise<void> {
    return sendRequest(`${sessionId}/pages/${pageId}`, "delete")
}
