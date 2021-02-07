import store from "../redux/store"
import { API_SESSION_URL } from "../constants"

import {
    CREATE_WS,
    RECEIVE_STROKES,
    SEND_STROKE,
} from "../redux/slice/webcontrol"

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
    store.dispatch(RECEIVE_STROKES(data))
}

function onClose(event) {
    console.log(event)
}

function onOpen() {
    console.log("WebSocket is open now.")
}

export function sendStroke(stroke) {
    if (store.getState().webControl.sessionId !== "") {
        store.dispatch(SEND_STROKE(stroke))
    }
}

export function receiveStrokes() {}
