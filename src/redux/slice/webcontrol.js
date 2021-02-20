import { createSlice } from "@reduxjs/toolkit"
import Konva from "konva"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"

const webControlSlice = createSlice({
    name: "webControl",
    initialState: {
        sessionDialog: {
            open: false,
            invalidSid: false,
            joinOnly: false,
            sidInput: "",
        },
        // strokesOutBuf: [],
        // strokesInBuf: [],
        webSocket: null,
        sessionId: "",
        user: {
            id: "", // Thats me!
            alias: uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: "",
                style: "capital",
            }),
            color: Konva.Util.getRandomColor(),
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
        SET_SDIAG: (state, action) => {
            state.sessionDialog = { ...state.sessionDialog, ...action.payload }
        },
        CLOSE_SDIAG: (state) => {
            state.sessionDialog = {
                open: false,
                invalidSid: false,
                joinOnly: false,
                sidInput: "",
            }
        },
        SET_USER_ALIAS: (state, action) => {
            state.user.alias = action.payload
        },
        SET_USER_COLOR: (state) => {
            state.user.color = Konva.Util.getRandomColor()
        },
    },
})

export const {
    CREATE_WS,
    CLOSE_WS,
    RECEIVE_STROKES,
    SEND_STROKE,
    SET_SESSION_USERS,
    SET_SID,
    SET_SDIAG,
    CLOSE_SDIAG,
    SET_USER_ALIAS,
    SET_USER_COLOR,
} = webControlSlice.actions
export default webControlSlice.reducer
