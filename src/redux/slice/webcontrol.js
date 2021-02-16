import { createSlice } from "@reduxjs/toolkit"

const webControlSlice = createSlice({
    name: "webControl",
    initialState: {
        // strokesOutBuf: [],
        // strokesInBuf: [],
        webSocket: null,
        sessionId: "",
        user: {
            id: "", // Thats me!
            alias: "",
            color: "",
        },
        connectedUsers: {},
    },
    reducers: {
        CREATE_WS: (state, action) => {
            const { ws, sessionId, user } = action.payload
            state.webSocket = ws
            state.sessionId = sessionId
            state.user = user
        },
        CLOSE_WS: (state) => {
            state.webSocket.close()
            state.webSocket = null
            state.sessionId = ""
            state.user = {}
        },
        // RECEIVE_STROKES: (state, action) => {
        //     const { data } = action.payload
        //     console.log(data)
        //     state.strokesInBuf.concat(JSON.parse(data))
        // },
        // for now we only send one stroke at a time
        SEND_STROKE: (state, action) => {
            // append userId
            const stroke = { ...action.payload, userId: state.user.id }
            state.webSocket.send(JSON.stringify([stroke]))
        },
        SET_SESSION_USERS: (state, action) => {
            state.connectedUsers = action.payload
        },
    },
})

export const {
    CREATE_WS,
    CLOSE_WS,
    RECEIVE_STROKES,
    SEND_STROKE,
    SET_SESSION_USERS,
} = webControlSlice.actions
export default webControlSlice.reducer
