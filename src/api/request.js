import axios from "axios"
import { API_URL } from "./types"

const apiRequest = axios.create({
    baseURL: API_URL,
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
export async function sendRequest(url, method, data = {}) {
    const response = await apiRequest({ url, method, data })
    return response.data
}

/**
 * @returns {{sessionId: string}}
 */
export async function createSession() {
    return sendRequest("/b/create", "post")
}

export async function createUser(sessionId, { alias, color }) {
    return sendRequest(`/b/${sessionId}/users`, "post", {
        alias,
        color,
    })
}

/**
 *
 * @param {*} sessionId
 * @returns {pageRank: []}
 */
export async function getPages(sessionId) {
    return sendRequest(`/b/${sessionId}/pages`, "get")
}

export async function getStrokes(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "get")
}

export async function addPage(sessionId, pageId, index) {
    return sendRequest(`/b/${sessionId}/pages`, "post", {
        pageId,
        index,
    })
}

export async function clearPage(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "put", {})
}

export async function deletePage(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "delete")
}
