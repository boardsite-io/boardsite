import Konva from "konva"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"
import { deleteObjectProperty } from "redux/helpers"
import { API_URL } from "api/types"
import { ConnectedUsers, SessionState } from "./session.types"

const initState: SessionState = {
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
    connectedUsers: {},
    apiURL: new URL(API_URL),
}

const sessionReducer = (state = initState, action: any): SessionState => {
    switch (action.type) {
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
        case "CREATE_WS": {
            const { ws, sessionId, user } = action.payload
            return {
                ...state,
                webSocket: ws,
                sessionId,
                user,
                connectedUsers: { ...state.connectedUsers, [user.id]: user },
            }
        }
        case "CLOSE_WS": {
            state.webSocket.close()
            // state.webSocket = null
            return {
                ...state,
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
                connectedUsers: {},
            }
        }
        case "USER_CONNECT": {
            const user = action.payload
            return {
                ...state,
                user: action.payload,
                connectedUsers: { ...state.connectedUsers, [user.id]: user },
            }
        }
        case "USER_DISCONNECT": {
            const { id } = action.payload
            const newConnectedUsers = deleteObjectProperty(
                id,
                state.connectedUsers
            ) as ConnectedUsers
            return {
                ...state,
                connectedUsers: newConnectedUsers,
            }
        }
        case "SET_SESSION_USERS": {
            return { ...state, connectedUsers: action.payload }
        }
        case "SET_SDIAG": {
            return {
                ...state,
                sessionDialog: { ...state.sessionDialog, ...action.payload },
            }
        }
        case "CLOSE_SDIAG": {
            return {
                ...state,
                sessionDialog: {
                    open: false,
                    invalidSid: false,
                    joinOnly: false,
                    sidInput: "",
                },
            }
        }
        case "SET_USER_ALIAS": {
            return { ...state, user: { ...state.user, alias: action.payload } }
        }
        case "SET_USER_COLOR": {
            return {
                ...state,
                user: { ...state.user, color: Konva.Util.getRandomColor() },
            }
        }
        case "SET_API_URL": {
            return { ...state, apiURL: action.payload }
        }
        default:
            return state
    }
}
export default sessionReducer
