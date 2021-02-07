import Axios from "axios"
import { nanoid } from "@reduxjs/toolkit"
import { API_URL } from "../constants"

const axios = Axios.create({
    baseURL: API_URL,
    headers: {
        post: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        put: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        patch: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    },
    timeout: 3000,
})

/**
 * Send data request to API.
 * @param {string} url
 * @param {*} data
 * @param {string} method
 */
export function sendRequest(url, method, data = {}) {
    data = JSON.stringify(data)
    return new Promise((resolve, reject) => {
        axios({ url, method, data })
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

export function addPage(sessionId, index) {
    const pageId = nanoid()
    return sendRequest(`/b/${sessionId}/pages`, "post", {
        pageId,
        index,
    })
}

export function clearPage(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "put", {})
}

export function deletePage(sessionId, pageId) {
    return sendRequest(`/b/${sessionId}/pages/${pageId}`, "delete")
}

export function deleteAllPages(sessionId) {
    // TODO
    console.log(sessionId)
}
