import { nanoid } from "@reduxjs/toolkit"
import store from "../redux/store"
import { addPage, createSession, getPages, getStrokes } from "./request"
import { API_SESSION_URL } from "../constants"
import { CREATE_WS } from "../redux/slice/webcontrol"
import {
    DELETE_ALL_PAGES,
    ADD_STROKE,
    ADD_MULTIPLE_STROKES,
    SET_PAGERANK,
} from "../redux/slice/boardcontrol"

/**
 * Connect to Websocket.
 */
export function createWebsocket(sessionId) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(
            `${API_SESSION_URL.replace("http", "ws", 1)}/${sessionId}`
        )
        ws.onmessage = onMessage
        ws.onopen = () => {
            store.dispatch(CREATE_WS({ ws, sessionId }))
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

export function receiveStrokes(strokes) {
    strokes.forEach((stroke) => {
        if (stroke.type > 0) {
            store.dispatch(ADD_STROKE(stroke))
        }
    })
}

export async function newSession() {
    const { sessionId } = await createSession()
    store.dispatch(DELETE_ALL_PAGES())
    // create a pageid which will be added when joining
    await addPage(sessionId, nanoid(8), 0)
    return sessionId
}

export async function joinSession(sessionId) {
    await createWebsocket(sessionId)

    // set the pages according to api
    const { pageRank } = await getPages(sessionId)
    store.dispatch(SET_PAGERANK(pageRank))

    // fetch data from each page
    pageRank.forEach(async (pageId) => {
        const strokes = await getStrokes(sessionId, pageId)
        store.dispatch(ADD_MULTIPLE_STROKES(strokes))
    })
}
