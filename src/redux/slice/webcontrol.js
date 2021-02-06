import { createSlice } from "@reduxjs/toolkit"

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
            const { ws, sessionId } = action.payload
            state.webSocket = ws
            state.webSocket.onmessage = (data) => {
                onMessage(state, data)
            }

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
    },
})

export const { CREATE_WS, CLOSE_WS, SEND_WS } = webControlSlice.actions
export default webControlSlice.reducer

export function onMessage(state, data) {
    // eslint-disable-next-line no-console
    console.log(data)
    // const strokes = data.data
    // state.strokesInBuf = state.strokesInBuf.concat(strokes)
}

export function onClose(event) {
    // eslint-disable-next-line no-console
    console.log(event)
}

export function onOpen() {
    // eslint-disable-next-line no-console
    console.log("WebSocket is open now.")
}
