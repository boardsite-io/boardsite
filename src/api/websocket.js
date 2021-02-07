import store from "../redux/store"
import { API_SESSION_URL } from "../constants"

import { CREATE_WS, RECEIVE_STROKES } from "../redux/slice/webcontrol"

/**
 * Connect to Websocket.
 */
export function createWebsocket(sessionId) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(
            `${API_SESSION_URL.replace("http", "ws", 1)}/${sessionId}`
        )
        ws.onmessage = onMessage
        ws.onclose = onClose
        ws.onopen = onOpen

        ws.onopen = () => {
            store.dispatch(CREATE_WS({ ws, sessionId }))
            resolve()
        }
        ws.onerror = (ev) => reject(ev)
    })
}

function onMessage(data) {
    console.log(data)
    store.dispatch(RECEIVE_STROKES(data))
}

function onClose(event) {
    console.log(event)
}

function onOpen() {
    console.log("WebSocket is open now.")
}

export function receiveStrokes() {}
