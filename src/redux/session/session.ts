import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Konva from "konva"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"
import { API_URL } from "api/types"
import {
    ConnectedUsers,
    CreateWs,
    SetApiUrl,
    SetSessionDialog,
    SetSessionUsers,
    SetUserAlias,
    User,
    UserConnect,
    UserDisconnect,
    WebControlState,
} from "./session.types"

const initState: WebControlState = {
    sessionDialog: {
        open: false,
        invalidSid: false,
        joinOnly: false,
        sidInput: "",
    },
    webSocket: {} as WebSocket,
    sessionId: "",
    user: {
        id: "",
        alias: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: "",
            style: "capital",
        }),
        color: Konva.Util.getRandomColor(),
    },
    connectedUsers: {} as ConnectedUsers,
    apiURL: new URL(API_URL),
}

const sessionSlice = createSlice({
    name: "session",
    initialState: initState,
    reducers: {
        CREATE_WS: (state, action: PayloadAction<CreateWs>) => {
            const { ws, sessionId, user } = action.payload
            state.webSocket = ws
            state.sessionId = sessionId
            state.user = user
            state.connectedUsers[user.id] = user
        },
        CLOSE_WS: (state) => {
            state.webSocket.close()
            // state.webSocket = null
            state.sessionId = ""
            state.user = {
                id: "",
                alias: uniqueNamesGenerator({
                    dictionaries: [adjectives, colors, animals],
                    separator: "",
                    style: "capital",
                }),
                color: Konva.Util.getRandomColor(),
            } as User
            state.connectedUsers = {}
        },
        // RECEIVE_STROKES: (state, action) => {
        //     const { data } = action.payload
        //     console.log(data)
        //     state.strokesInBuf.concat(JSON.parse(data))
        // },
        // for now we only send one stroke at a time
        // SEND_STROKE: (state, action) => {
        //     // append userId
        //     const stroke = { ...action.payload, userId: state.user.id }
        //     state.webSocket.send(JSON.stringify([stroke]))
        // },
        USER_CONNECT: (state, action: PayloadAction<UserConnect>) => {
            const user = action.payload
            state.connectedUsers[user.id] = user
        },
        USER_DISCONNECT: (state, action: PayloadAction<UserDisconnect>) => {
            const { id } = action.payload
            delete state.connectedUsers[id]
        },
        SET_SESSION_USERS: (state, action: PayloadAction<SetSessionUsers>) => {
            state.connectedUsers = action.payload
        },
        SET_SESSION_DIALOG: (
            state,
            action: PayloadAction<SetSessionDialog>
        ) => {
            state.sessionDialog = { ...state.sessionDialog, ...action.payload }
        },
        CLOSE_SESSION_DIALOG: (state) => {
            state.sessionDialog = {
                open: false,
                invalidSid: false,
                joinOnly: false,
                sidInput: "",
            }
        },
        SET_USER_ALIAS: (state, action: PayloadAction<SetUserAlias>) => {
            state.user.alias = action.payload
        },
        SET_USER_COLOR: (state) => {
            state.user.color = Konva.Util.getRandomColor()
        },
        SET_API_URL: (state, action: PayloadAction<SetApiUrl>) => {
            state.apiURL = action.payload
        },
    },
})

export const {
    CREATE_WS,
    CLOSE_WS,
    USER_CONNECT,
    USER_DISCONNECT,
    SET_SESSION_USERS,
    SET_SESSION_DIALOG,
    CLOSE_SESSION_DIALOG,
    SET_USER_ALIAS,
    SET_USER_COLOR,
    SET_API_URL,
} = sessionSlice.actions
export default sessionSlice.reducer
