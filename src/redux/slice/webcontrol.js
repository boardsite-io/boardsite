import { createSlice } from "@reduxjs/toolkit"
import store from "../store"

const webControlSlice = createSlice({
    name: "webControl",
    initialState: {
        strokesOutBuf: [],
        strokesInBuf: [],
        webSocket: null,
        sessionId: "",
    },
    reducers: {
        CREATE_WS: (state, action) => {
            const { websocket, sessionId } = action.payload
            state.webSocket = websocket
            state.webSocket.onmessage = (data) => onMessage(JSON.parse(data))
            state.webSocket.onclose = onClose
            state.webSocket.onopen = onOpen
            state.sessionId = sessionId
        },
        CLOSE_WS: (state) => {
            state.webSocket.close()
            state.webSocket = null
            state.connected = false
        },
        SEND_WS: (state) => {
            state.webSocket.send(JSON.stringify(state.strokeOutBuf))
        },
        RECEIVE_WS: (state, payload) => {
            const { strokes } = payload
            state.webSocket.strokesInBuf = state.webSocket.strokesInBuf.concat(
                strokes
            )
        },
    },
})

export const {
    CREATE_WS,
    CLOSE_WS,
    SEND_WS,
    RECEIVE_WS,
} = webControlSlice.actions
export default webControlSlice.reducer

export function onMessage(states) {
    store.dispatch(RECEIVE_WS(states))
}

export function onClose(event) {
    // eslint-disable-next-line no-console
    console.log(event)
}

export function onOpen() {
    // eslint-disable-next-line no-console
    console.log("WebSocket is open now.")
}
