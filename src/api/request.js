import axios from "axios"
import store from "../redux/store"

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
export async function sendRequest(url, method, data = {}) {
    const baseURL = store.getState().webControl.apiURL.toString()
    const response = await apiRequest({
        url: `${baseURL}b/${url}`,
        method,
        data,
    })
    return response.data
}

/**
 * @returns {{sessionId: string}}
 */
export async function createSession() {
    return sendRequest("create", "post")
}

export async function getUsers(sessionId) {
    return sendRequest(`${sessionId}/users`, "get")
}

export async function createUser(sessionId, { alias, color }) {
    return sendRequest(`${sessionId}/users`, "post", {
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
    return sendRequest(`${sessionId}/pages`, "get")
}

export async function getStrokes(sessionId, pageId) {
    return sendRequest(`${sessionId}/pages/${pageId}`, "get")
}

export async function addPage(sessionId, pageId, index, meta) {
    return sendRequest(`${sessionId}/pages`, "post", {
        pageId,
        index,
        meta,
    })
}

export async function clearPage(sessionId, pageId) {
    return sendRequest(`${sessionId}/pages/${pageId}`, "put", {})
}

export async function deletePage(sessionId, pageId) {
    return sendRequest(`${sessionId}/pages/${pageId}`, "delete")
}
