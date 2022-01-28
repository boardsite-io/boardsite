import {
    AttachId,
    AttachType,
    Page,
    PageCollection,
} from "redux/board/board.types"
import { Stroke, StrokeUpdate, ToolType } from "drawing/stroke/index.types"
import { Util } from "konva/lib/Util"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"
import store from "redux/store"
import { assign } from "lodash"
import { BoardPage } from "drawing/page"
import { CREATE_SESSION } from "redux/session/session"
import {
    ADD_ATTACHMENTS,
    ADD_STROKES,
    CLEAR_ATTACHMENTS,
    CLEAR_PAGES,
    DELETE_ALL_PAGES,
    ERASE_STROKES,
    SET_PAGEMETA,
    SYNC_PAGES,
} from "redux/board/board"
import { newAttachment } from "drawing/attachment/utils"
import {
    ConnectedUsers,
    Message,
    messages,
    MessageType,
    ResponsePageSync,
    ResponsePageUpdate,
    Session,
    StrokeDelete,
    User,
} from "./types"
import { API_URL, Request } from "./request"

export class BoardSession implements Session {
    id?: string
    apiURL: URL
    user: User
    request: Request
    socket?: WebSocket
    users?: ConnectedUsers

    constructor(url?: string) {
        this.apiURL = new URL(url ?? API_URL)
        this.request = new Request(this.apiURL.toString())
        this.user = {
            alias: uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: "",
                style: "capital",
            }),
            color: Util.getRandomColor(),
        }
    }

    updateUser(user: Partial<User>): void {
        assign(this.user, user)
    }

    setAPIURL(url: URL): void {
        this.apiURL = url
    }

    setID(sessionId: string): Session {
        this.id = sessionId
        this.request = new Request(this.apiURL.toString(), this.id)
        return this
    }

    async create(): Promise<string> {
        const { sessionId } = await this.request.postSession()
        this.setID(sessionId)
        store.dispatch(DELETE_ALL_PAGES())
        return sessionId
    }

    async join(): Promise<void> {
        if (!isConnected) {
            throw new Error("no open websocket")
        }
        this.users = await this.request.getUsers()

        // set the pages according to api
        store.dispatch(CLEAR_ATTACHMENTS()) // clear documents which may be overwritten by session
        store.dispatch(DELETE_ALL_PAGES())
        const { pageRank, meta } = await this.request.getPages()
        await BoardSession.syncPages({ pageRank, meta })

        if (pageRank.length === 0) {
            // create a page if there are none yet
            await this.request.postPages([new BoardPage()], [0])
        }

        // fetch data from each page
        Promise.all(
            pageRank.map(async (pageId) => {
                const strokes = await this.request.getStrokes(pageId)
                store.dispatch(ADD_STROKES({ data: strokes }))
            })
        )
    }

    async createSocket(sessionId: string): Promise<void> {
        this.setID(sessionId)
        // create a new user for us
        const { id } = await this.request.postUser(this.user)
        this.user.id = id

        return new Promise((resolve, reject) => {
            const url = new URL(this.apiURL.toString())
            url.protocol = url.protocol.replace("http", "ws")
            this.socket = new WebSocket(
                `${url.toString()}b/${this.id}/users/${this.user.id}/socket`
            )
            this.socket.onmessage = (msg) => this.receive(JSON.parse(msg.data))
            this.socket.onopen = () => resolve()
            this.socket.onerror = (ev) => reject(ev)
        })
    }

    isConnected(): boolean {
        return (
            this.id !== "" &&
            this.socket != null &&
            this.socket?.readyState === WebSocket.OPEN
        )
    }

    disconnect(): void {
        this.socket?.close()
        this.users = {}
        store.dispatch(CLEAR_ATTACHMENTS())
        store.dispatch(DELETE_ALL_PAGES())
    }

    send(type: MessageType, content: unknown): void {
        const message: Message<typeof content> = {
            type,
            sender: this.user.id as string,
            content,
        }
        this.socket?.send(JSON.stringify(message))
    }

    sendStrokes(strokes: Stroke[] | StrokeUpdate[]): void {
        const strokesToSend = strokes
            .map((s) => {
                if (s.id && s.pageId) {
                    const serialized = (s as Stroke).serialize?.()
                    return {
                        ...serialized,
                        userId: this.user.id, // append the user id to strokes
                    }
                }
                return null
            })
            .filter((s) => s)
        this.send(messages.Stroke, strokesToSend)
    }

    eraseStrokes(strokes: StrokeDelete[]): void {
        this.send(
            messages.Stroke,
            strokes.map((s) => ({
                id: s.id,
                pageId: s.pageId,
                type: ToolType.Eraser,
                userId: this.user.id,
            }))
        )
    }

    async addPages(pages: BoardPage[], pageIndex: number[]): Promise<void> {
        this.request.postPages(pages, pageIndex)
    }

    async deletePages(pageIds: string[]): Promise<void> {
        this.request.deletePages(pageIds)
    }

    async updatePages(
        pages: Pick<Page, "pageId" | "meta">[],
        clear = false
    ): Promise<void> {
        this.request.putPages(pages, clear)
    }

    async addAttachment(file: File): Promise<string> {
        const { attachId } = await this.request.postAttachment(file)
        return attachId
    }

    getAttachment(attachId: string): Promise<Uint8Array> {
        return this.request.getAttachment(attachId)
    }

    attachURL(attachId: string): URL {
        return new URL(
            attachId,
            `${this.apiURL.toString()}b/${this.id}/attachments/`
        )
    }

    ping(): Promise<ResponsePageSync> {
        return this.request.getPages()
    }

    userConnect(user: User): void {
        this.users = {
            ...this.users,
            [user.id as string]: user,
        }
    }

    userDisconnect({ id }: User): void {
        delete this.users?.[id as string]
    }

    receive(message: Message<unknown>): void {
        switch (message.type) {
            case messages.Stroke:
                BoardSession.receiveStrokes(message.content as Stroke[])
                break

            case messages.PageSync:
                BoardSession.syncPages(message.content as ResponsePageSync)
                break

            case messages.PageUpdate:
                BoardSession.updatePageMeta(
                    message.content as ResponsePageUpdate
                )
                break

            case messages.UserConnected:
                this.userConnect(message.content as User)
                break

            case messages.UserDisconnected:
                this.userDisconnect(message.content as User)
                break

            default:
                break
        }
    }

    static receiveStrokes(strokes: Stroke[]): void {
        const erasedStrokes = strokes.filter((s) => s.type === 0)
        if (erasedStrokes.length > 0) {
            store.dispatch(ERASE_STROKES({ data: erasedStrokes }))
        }

        strokes = strokes.filter((s) => s.type !== 0)
        if (strokes.length > 0) {
            store.dispatch(ADD_STROKES({ data: strokes }))
        }
    }

    static async syncPages({
        pageRank,
        meta,
    }: ResponsePageSync): Promise<void> {
        const { pageCollection } = store.getState().board
        const newPageCollection: PageCollection = {}
        for (let i = 0; i < pageRank.length; i++) {
            const pid = pageRank[i]
            if (Object.prototype.hasOwnProperty.call(pageCollection, pid)) {
                newPageCollection[pid] = pageCollection[pid]
            } else {
                newPageCollection[pid] = new BoardPage().setID(pid)
            }
            if (meta[pid]) {
                newPageCollection[pid].updateMeta(meta[pid])
            }

            // if the background is based on an attachment load it
            const { attachId } = meta[pid].background
            if (attachId) {
                await loadAttachment(AttachType.PDF, attachId)
            }
        }

        store.dispatch(
            SYNC_PAGES({ pageRank, pageCollection: newPageCollection })
        )
    }

    static updatePageMeta({ pageId, meta, clear }: ResponsePageUpdate): void {
        if (clear) {
            store.dispatch(CLEAR_PAGES({ data: pageId }))
        }
        pageId.forEach((pid) =>
            store.dispatch(
                SET_PAGEMETA({ data: [{ pageId: pid, meta: meta[pid] }] })
            )
        )
    }

    static path(sessionURL: string): string {
        const url = sessionURL.split("/")
        return `/b/${url[url.length - 1]}`
    }
}

/**
 * Fetches the current session instance from redux.
 * Creates a new instance if not found.
 */
export const currentSession = (): Session => {
    let { session } = store.getState().session
    if (!session) {
        session = new BoardSession()
        store.dispatch(CREATE_SESSION({ session }))
    }
    return session
}

export const isConnected = (): boolean => {
    const { session } = store.getState().session
    return session !== undefined && session.isConnected()
}

// loads an attachment into the cache
const loadAttachment = async (
    type: AttachType,
    id: AttachId
): Promise<void> => {
    if (store.getState().board.attachments[id]) {
        // already loaded
        return
    }
    const blob = await currentSession().getAttachment(id)
    const attachment = await newAttachment({
        type,
        id,
        cachedBlob: blob,
    }).render()
    store.dispatch(ADD_ATTACHMENTS([attachment]))
}
