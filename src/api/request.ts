import axios, { AxiosRequestConfig } from "axios"
import { store } from "../redux/store"

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
export async function sendRequest(url: string, method: string, data?: any) {
    const baseURL = store.getState().webControl.apiURL.toString()
    const response = await apiRequest({
        url: `${baseURL}b/${url}`,
        method,
        data,
    } as AxiosRequestConfig)
    return response.data
}

export async function createSession() {
    return sendRequest("create", "post")
}

export async function getUsers(sessionId: string): Promise<any> {
    return sendRequest(`${sessionId}/users`, "get")
}

export async function createUser(sessionId: string, data: any) {
    return sendRequest(`${sessionId}/users`, "post", data)
}

export async function getPages(sessionId: string) {
    return sendRequest(`${sessionId}/pages`, "get")
}

export async function getStrokes(sessionId: string, pageId: string) {
    return sendRequest(`${sessionId}/pages/${pageId}`, "get")
}

export async function addPage(
    sessionId: string,
    pageId: string,
    index: number,
    meta?: any
) {
    return sendRequest(`${sessionId}/pages`, "post", {
        pageId,
        index,
        meta,
    })
}

export async function updatePage(
    sessionId: string,
    pageId: string,
    content: any
) {
    return sendRequest(`${sessionId}/pages/${pageId}`, "put", content)
}

export async function deletePage(sessionId: string, pageId: string) {
    return sendRequest(`${sessionId}/pages/${pageId}`, "delete")
}
