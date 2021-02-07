import axios from "axios"
import { nanoid } from "@reduxjs/toolkit"
import { API_URL } from "../constants"

const apiRequest = axios.create({
    baseURL: API_URL,
    transformRequest: [(data) => JSON.stringify(data)],
    transformResponse: [(data) => JSON.parse(data)],
    headers: {
        // eslint-disable-next-line prettier/prettier
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    timeout: 3000,
})

/**
 * Send data request to API.
 */
export async function sendRequest(url, method, data = {}) {
    try {
        const response = await apiRequest({ url, method, data })
        return response.data
    } catch (error) {
        return error
    }
}

export async function createSession() {
    return sendRequest("/b/create", "post")
}

export async function getPages(sessionId) {
    return sendRequest(`/b/${sessionId}/pages`, "get")
}

export async function addPage(sessionId, index) {
    const pageId = nanoid()
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

export async function deleteAllPages(sessionId) {
    // TODO
    console.log(sessionId)
}
