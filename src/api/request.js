import { API_URL } from "../constants"

/**
 * Send data request to API.
 * @param {string} url
 * @param {*} data
 * @param {string} method
 */
export function sendRequest(url, method, data = {}) {
    return new Promise((resolve, reject) => {
        fetch(`${API_URL}${url}`, {
            method,
            body: JSON.stringify(data),
        })
            .then((response) =>
                response
                    .json()
                    .then((responseData) => {
                        if (!response.ok) {
                            // in case of error, api returns obj with 'error' key
                            reject(new Error())
                        } else {
                            resolve(responseData) // successful fetch
                        }
                    })
                    .catch(() => resolve({}))
            )
            .catch(() => reject())
    })
}

export function createSession() {
    return sendRequest("/b/create", "POST")
}

export function getPages(sessionId) {
    return sendRequest(`/b/${sessionId}/pages`, "GET")
}

export function addPage(sessionID, pageId, index) {
    return sendRequest(`/b/${sessionID}/pages`, "POST", { pageId, index })
}

export function clearPage(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "PUT", {})
}

export function deletePage(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "DELETE")
}
