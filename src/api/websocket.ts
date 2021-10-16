import { Stroke, ToolType } from "redux/drawing/drawing.types"
import { Page, PageCollection } from "redux/board/board.types"
import { createPage } from "redux/board/util/page"
import store from "redux/store"
import {
    postPages,
    putPages,
    postSession,
    postUser,
    deletePages,
    getPages,
    getStrokes,
    getUsers,
    postAttachment,
    getAttachment,
} from "./request"
import {
    User,
    MessageType,
    Message,
    messages,
    ResponsePageSync,
    ResponsePageUpdate,
} from "./types"

/**
 * Connect to Websocket.
 */
function createWebsocket(
    sessionId: string,
    user: User
): Promise<Event | undefined> {
    return new Promise((resolve, reject) => {
        const url = new URL(store.getState().session.apiURL.toString())
        url.protocol = url.protocol.replace("http", "ws")
        const ws = new WebSocket(
            `${url.toString()}b/${sessionId}/users/${user.id}/socket`
        )
        ws.onmessage = (msg) => {
            receive(JSON.parse(msg.data))
        }
        ws.onopen = () => {
            store.dispatch({
                type: "CREATE_WS",
                payload: { ws, sessionId, user },
            })
            resolve(undefined)
        }
        ws.onerror = (ev) => reject(ev)
    })
}

function send(type: MessageType, content: unknown): void {
    const message: Message<typeof content> = {
        type,
        sender: store.getState().session.user.id,
        content,
    }
    const ws = store.getState().session.webSocket as WebSocket
    ws.send(JSON.stringify(message))
}

/**
 * Receive a message via websocket connection.
 */
function receive(message: Message<unknown>) {
    switch (message.type) {
        case messages.Stroke:
            receiveStrokes(message.content as Stroke[])
            break

        case messages.PageSync:
            syncPages(message.content as ResponsePageSync)
            break

        case messages.PageUpdate:
            updatePageMeta(message.content as ResponsePageUpdate)
            break

        case messages.UserConnected:
            store.dispatch({
                type: "USER_CONNECT",
                payload: message.content,
            })
            break

        case messages.UserDisconnected:
            store.dispatch({
                type: "USER_DISCONNECT",
                payload: message.content,
            })
            break

        default:
            break
    }
}

function receiveStrokes(strokes: Stroke[]) {
    strokes.forEach((stroke) => {
        if (stroke.type > 0) {
            store.dispatch({
                type: "ADD_STROKES",
                payload: [stroke],
            })
        } else if (stroke.type === 0) {
            store.dispatch({
                type: "ERASE_STROKES",
                payload: [stroke],
            })
        }
    })
}

function syncPages({ pageRank, meta }: ResponsePageSync) {
    if (pageRank.length === 0) {
        store.dispatch({
            type: "DELETE_ALL_PAGES",
            payload: undefined,
        })
        return
    }
    const { pageCollection } = store.getState().board
    const newPageCollection: PageCollection = {}
    pageRank.forEach((pid: string) => {
        if (Object.prototype.hasOwnProperty.call(pageCollection, pid)) {
            newPageCollection[pid] = pageCollection[pid]
        } else {
            newPageCollection[pid] = createPage({
                id: pid,
                style: store.getState().board.pageSettings.background,
            })
        }
    })

    store.dispatch({
        type: "SET_PAGERANK",
        payload: { pageRank, pageCollection: newPageCollection },
    })
    Object.keys(meta).forEach((pageId) =>
        store.dispatch({
            type: "SET_PAGEMETA",
            payload: { pageId, meta: meta[pageId] },
        })
    )
}

function updatePageMeta({ pageId, meta, clear }: ResponsePageUpdate) {
    if (clear) {
        pageId.forEach((pid) =>
            store.dispatch({
                type: "CLEAR_PAGE",
                payload: pid,
            })
        )
    }
    pageId.forEach((pid) =>
        store.dispatch({
            type: "SET_PAGEMETA",
            payload: { pageId: pid, meta: meta[pid] },
        })
    )
}

export function isConnected(): boolean {
    return (
        store.getState().session.sessionId !== "" &&
        store.getState().session.webSocket != null &&
        store.getState().session.webSocket.readyState === WebSocket.OPEN
    )
}

export async function newSession(): Promise<string> {
    const { sessionId } = await postSession()
    store.dispatch({
        type: "DELETE_ALL_PAGES",
        payload: undefined,
    })
    // create a pageid which will be added when joining
    await postPages(sessionId, [createPage({})], [0])
    return sessionId
}

export async function joinSession(
    sessionId = store.getState().session.sessionDialog.sidInput,
    alias = store.getState().session.user.alias,
    color = store.getState().session.user.color
): Promise<void> {
    // create a new user for us
    const user = await postUser(sessionId, { alias, color } as User)
    await createWebsocket(sessionId, user)

    store.dispatch({
        type: "SET_SESSION_USERS",
        payload: await getUsers(sessionId),
    })

    // set the pages according to api
    store.dispatch({
        type: "DELETE_ALL_PAGES",
        payload: undefined,
    })
    const { pageRank, meta } = await getPages(sessionId)
    syncPages({ pageRank, meta })

    // fetch data from each page
    pageRank.forEach(async (pageId) => {
        const strokes = await getStrokes(sessionId, pageId)
        store.dispatch({
            type: "ADD_STROKES",
            payload: strokes,
        })
    })
}

export function sendStrokes(strokes: Stroke[]): void {
    // append the user id to strokes
    send(
        messages.Stroke,
        strokes.map((stroke) => ({
            ...stroke,
            hitboxes: undefined,
            userId: store.getState().session.user.id,
        }))
    )
}

export function eraseStrokes(strokes: { id: string; pageId: string }[]): void {
    send(
        messages.Stroke,
        strokes.map((stroke) => ({
            id: stroke.id,
            pageId: stroke.pageId,
            type: ToolType.Eraser,
            userId: store.getState().session.user.id,
        }))
    )
}

export function addPagesSession(pages: Page[], pageIndex: number[]): void {
    postPages(store.getState().session.sessionId, pages, pageIndex)
}

export function deletePagesSession(pageIds: string[]): void {
    deletePages(store.getState().session.sessionId, pageIds)
}

// returns the relative path to the session
// based on either the sessionID or the URL
export function getSessionPath(sessionURL: string): string {
    const url = sessionURL.split("/")
    return `/b/${url[url.length - 1]}`
}

export function pingSession(sessionID: string): Promise<ResponsePageSync> {
    return getPages(sessionID)
}

export function updatePagesSession(pages: Page[], clear = false): void {
    putPages(store.getState().session.sessionId, pages, clear)
}

export async function addAttachmentSession(file: File): Promise<string> {
    const { attachId } = await postAttachment(
        store.getState().session.sessionId,
        file
    )
    return attachId
}

export function getAttachmentSession(attachId: string): Promise<unknown> {
    return getAttachment(store.getState().session.sessionId, attachId)
}
