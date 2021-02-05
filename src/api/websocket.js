// import { toolType } from "../../constants"
import store from "../redux/store"
import { API_SESSION_URL } from "../constants"

import { CREATE_WS } from "../redux/slice/webcontrol"

/**
 * Connect to Websocket.
 */
// eslint-disable-next-line import/prefer-default-export
export async function createWebsocket(sessionId) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(
            `${API_SESSION_URL.replace("http", "ws", 1)}/${sessionId}`
        )
        ws.name = "XD"
        ws.onopen = () => {
            store.dispatch(CREATE_WS(ws))
            resolve()
        }
        ws.onerror = (ev) => reject(ev)
    })
}
