import { nanoid } from "@reduxjs/toolkit"
import store from "../redux/store"
import {
    addPage,
    clearPage,
    createSession,
    createUser,
    deletePage,
    getPages,
    getStrokes,
    getUsers,
} from "./request"
import { toolType } from "../constants"
import {
    CREATE_WS,
    SET_SESSION_USERS,
    USER_CONNECT,
    USER_DISCONNECT,
} from "../redux/slice/webcontrol"
import {
    DELETE_ALL_PAGES,
    ADD_STROKE,
    ADD_MULTIPLE_STROKES,
    SET_PAGERANK,
    ERASE_STROKE,
    CLEAR_PAGE,
    SET_PAGEMETA,
} from "../redux/slice/boardcontrol"
import { API_SESSION_URL, MessageType, newMessage } from "./types"

/**
 * Connect to Websocket.
 */
export function createWebsocket(sessionId, user) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(
            `${API_SESSION_URL.replace("http", "ws", 1)}/${sessionId}/users/${
                user.id
            }/socket`
        )
        ws.onmessage = (msg) => {
            receive(JSON.parse(msg.data))
        }
        ws.onopen = () => {
            store.dispatch(CREATE_WS({ ws, sessionId, user }))
            resolve()
        }
        ws.onerror = (ev) => reject(ev)
    })
}

export function send(type = "", content = {}) {
    const message = newMessage(
        type,
        store.getState().webControl.user.id,
        content
    )
    store.getState().webControl.webSocket.send(JSON.stringify(message))
}

/**
 * Receive a message via websocket connection.
 * @param {{type: string, sender: string, content: any}} message message
 */
function receive(message) {
    switch (message.type) {
        case MessageType.Stroke:
            receiveStrokes(message.content)
            break

        case MessageType.PageSync:
            syncPages(message.content)
            break

        case MessageType.PageClear:
            message.content.forEach((pid) => store.dispatch(CLEAR_PAGE(pid)))
            break

        case MessageType.UserConnected:
            store.dispatch(USER_CONNECT(message.content))
            break

        case MessageType.UserDisconnected:
            store.dispatch(USER_DISCONNECT(message.content))
            break

        default:
            break
    }
}

function receiveStrokes(strokes) {
    strokes.forEach((stroke) => {
        if (stroke.type > 0) {
            // add stroke
            store.dispatch(ADD_STROKE(stroke))
        } else if (stroke.type === 0) {
            // delete stroke
            store.dispatch(ERASE_STROKE(stroke))
        }
    })
}

function syncPages({ pageRank, meta }) {
    store.dispatch(SET_PAGERANK(pageRank))
    Object.keys(meta).forEach((pageId) =>
        store.dispatch(SET_PAGEMETA({ pageId, meta: meta[pageId] }))
    )
}

export function isConnected() {
    return (
        store.getState().webControl.sessionId !== "" &&
        store.getState().webControl.webSocket != null &&
        store.getState().webControl.webSocket.readyState === WebSocket.OPEN
    )
}

export async function newSession() {
    const sessionId = await createSession()
    store.dispatch(DELETE_ALL_PAGES())
    // create a pageid which will be added when joining
    await addPage(sessionId, nanoid(8), 0)
    return sessionId
}

export async function joinSession(
    sessionId = store.getState().webControl.sessionDialog.sidInput,
    alias = store.getState().webControl.user.alias,
    color = store.getState().webControl.user.color
) {
    // create a new user for us
    const user = await createUser(sessionId, { alias, color })
    await createWebsocket(sessionId, user)

    store.dispatch(SET_SESSION_USERS(await getUsers(sessionId)))

    // set the pages according to api
    store.dispatch(DELETE_ALL_PAGES())
    const { pageRank, meta } = await getPages(sessionId)
    syncPages({ pageRank, meta })

    // fetch data from each page
    pageRank.forEach(async (pageId) => {
        const strokes = await getStrokes(sessionId, pageId)
        store.dispatch(ADD_MULTIPLE_STROKES(strokes))
    })
}

export function sendStroke(stroke) {
    // append the user id to stroke
    send(MessageType.Stroke, [
        { ...stroke, userId: store.getState().webControl.user.id },
    ])
}

export function eraseStroke({ id, pageId }) {
    sendStroke({ id, pageId, type: toolType.ERASER })
}

export function addPageSession(pageIndex, meta) {
    addPage(store.getState().webControl.sessionId, nanoid(8), pageIndex, meta)
}

export function clearPageSession(pageId) {
    clearPage(store.getState().webControl.sessionId, pageId)
}

export function deletePageSession(pageId) {
    deletePage(store.getState().webControl.sessionId, pageId)
}

// returns the relative path to the session
// based on either the sessionID or the URL
export function getSessionPath(sessionURL) {
    const url = sessionURL.split("/")
    return `/b/${url[url.length - 1]}`
}

export function pingSession(sessionID) {
    return getPages(sessionID)
}
