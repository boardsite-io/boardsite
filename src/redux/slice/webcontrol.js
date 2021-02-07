import { createSlice } from "@reduxjs/toolkit"

const webControlSlice = createSlice({
    name: "webControl",
    initialState: {
        // strokesOutBuf: [],
        strokesInBuf: [],
        webSocket: null,
        sessionId: "",
    },
    reducers: {
        CREATE_WS: (state, action) => {
            const { ws, sessionId } = action.payload
            state.webSocket = ws
            state.sessionId = sessionId
        },
        CLOSE_WS: (state) => {
            state.webSocket.close()
            state.webSocket = null
            state.sessionId = ""
        },
        RECEIVE_STROKES: (state, action) => {
            const { data } = action.payload
            state.strokesInBuf.concat(JSON.parse(data))
        },
        // for now we only send one stroke at a time
        SEND_STROKE: (state, action) => {
            const stroke = action.payload
            state.webSocket.send(JSON.stringify([stroke]))
        },
    },
})

export const {
    CREATE_WS,
    CLOSE_WS,
    RECEIVE_STROKES,
    SEND_STROKE,
} = webControlSlice.actions
export default webControlSlice.reducer
