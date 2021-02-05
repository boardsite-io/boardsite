// import { toolType } from "../../constants"
import store from "../redux/store"
import { API_SESSION_URL } from "../constants"

import { CREATE_WS } from "../redux/slice/webcontrol"

/**
 * Connect to Websocket.
 */
// eslint-disable-next-line import/prefer-default-export
export async function createWebsocket(sessionId) {
    const ws = new WebSocket(
        `${API_SESSION_URL.replace("http", "ws", 1)}/${sessionId}`
    )

    try {
        await new Promise((resolve, reject) => {
            for (let i = 0; i < 200; i += 1) {
                // max 2 sec
                setTimeout(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        resolve()
                    }
                }, 10)
            }
            reject()
        })

        store.dispatch(CREATE_WS(ws))
    } catch {
        // cannot connect to websocket
    }
}
