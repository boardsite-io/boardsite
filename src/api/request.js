import axios from "axios"
import { API_URL } from "../constants"

/**
 * Send data request to API.
 * @param {string} url
 * @param {*} data
 * @param {string} method
 */
export function sendRequest(url, method, data = {}) {
    return new Promise((resolve, reject) => {
        axios({
            url: `${API_URL}${url}`,
            method,
            data: JSON.stringify({ data }),
        })
            .then((response) => {
                if (response.statusText === "OK") {
                    resolve(response)
                } else {
                    // in case of error, api returns obj with 'error' key
                    reject(new Error())
                }
            })
            .catch(() => reject())
    })
}

export function createSession() {
    return sendRequest("/b/create", "post")
}

export function getPages(sessionId) {
    return sendRequest(`/b/${sessionId}/pages`, "get")
}

export function addPage(sessionID, pageId, index) {
    return sendRequest(`/b/${sessionID}/pages`, "post", { pageId, index })
}

export function clearPage(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "put", {})
}

export function deletePage(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "delete")
}
