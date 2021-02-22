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
} from "./request"
import { toolType, API_SESSION_URL } from "../constants"
import {
    CREATE_WS,
    SEND_STROKE,
    SET_SESSION_USERS,
} from "../redux/slice/webcontrol"
import {
    DELETE_ALL_PAGES,
    ADD_STROKE,
    ADD_MULTIPLE_STROKES,
    SET_PAGERANK,
    ERASE_STROKE,
    CLEAR_PAGE,
} from "../redux/slice/boardcontrol"

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
        ws.onmessage = onMessage
        ws.onopen = () => {
            store.dispatch(CREATE_WS({ ws, sessionId, user }))
            resolve()
        }
        ws.onerror = (ev) => reject(ev)
    })
}

function onMessage(msg) {
    const strokes = JSON.parse(msg.data)
    receiveStrokes(strokes)
    // store.dispatch(RECEIVE_STROKES(data))
}

function receiveStrokes(strokes) {
    strokes.forEach((stroke) => {
        if (stroke.type > 0) {
            // add stroke
            store.dispatch(ADD_STROKE(stroke))
        } else if (stroke.type === 0) {
            // delete stroke
            store.dispatch(ERASE_STROKE(stroke))
        } else {
            // non-stroke type, e.g. pageRank update, messages
            receiveGeneric(stroke)
        }
    })
}

// Non-stroke types (type < 0) receive handler
function receiveGeneric(stroke) {
    // properties are mutually exclusive
    // we may assume the server sends correct data
    if (Object.prototype.hasOwnProperty.call(stroke, "pageRank")) {
        store.dispatch(SET_PAGERANK(stroke.pageRank))
    } else if (Object.prototype.hasOwnProperty.call(stroke, "pageClear")) {
        stroke.pageClear.forEach((pid) => store.dispatch(CLEAR_PAGE(pid)))
    } else if (Object.prototype.hasOwnProperty.call(stroke, "connectedUsers")) {
        store.dispatch(SET_SESSION_USERS(stroke.connectedUsers))
    }
}

export function isConnected() {
    return (
        store.getState().webControl.sessionId !== "" &&
        store.getState().webControl.webSocket != null &&
        store.getState().webControl.webSocket.readyState === WebSocket.OPEN
    )
}

export async function newSession() {
    const { sessionId } = await createSession()
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

    // set the pages according to api
    const { pageRank } = await getPages(sessionId)
    store.dispatch(SET_PAGERANK(pageRank))

    // fetch data from each page
    pageRank.forEach(async (pageId) => {
        const strokes = await getStrokes(sessionId, pageId)
        store.dispatch(ADD_MULTIPLE_STROKES(strokes))
    })
}

export function sendStroke(stroke) {
    store.dispatch(SEND_STROKE(stroke))
}

export function eraseStroke({ id, pageId }) {
    const stroke = { id, pageId, type: toolType.ERASER }
    store.dispatch(SEND_STROKE(stroke))
}

export function addPageSession(pageIndex) {
    addPage(store.getState().webControl.sessionId, nanoid(8), pageIndex)
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
