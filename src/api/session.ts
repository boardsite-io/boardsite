import { PageCollection } from "redux/board/board.types"
import { Stroke, StrokeUpdate, ToolType } from "drawing/stroke/types"
import Konva from "konva"
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
import { handleLoadFromSource } from "drawing/pdf/io"
import {
    ADD_STROKES,
    CLEAR_DOCS,
    CLEAR_PAGE,
    DELETE_ALL_PAGES,
    ERASE_STROKES,
    SET_PAGEMETA,
    SET_PAGERANK,
} from "redux/board/board"
import {
    API_URL,
    ConnectedUsers,
    Message,
    messages,
    MessageType,
    ResponsePageSync,
    ResponsePageUpdate,
    Session,
    User,
} from "./types"
import { Request } from "./request"

export class BoardSession implements Session {
    id?: string
    apiURL: URL
    user: User
    request: Request
    socket?: WebSocket
    users?: ConnectedUsers

    constructor() {
        this.apiURL = new URL(API_URL)
        this.request = new Request(this.apiURL.toString())
        this.user = {
            alias: uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: "",
                style: "capital",
            }),
            color: Konva.Util.getRandomColor(),
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
        // create a pageid which will be added when joining
        await this.request.postPages([new BoardPage()], [0])
        return sessionId
    }

    async join(sessionId?: string): Promise<void> {
        if (!sessionId) {
            throw new Error("no sessionId given")
        }

        this.setID(sessionId)
        // create a new user for us
        const { id } = await this.request.postUser(this.user)
        this.user.id = id
        await this.createSocket()

        // store.dispatch(SET_SESSION_USERS(await getUsers(sessionId)))
        this.users = await this.request.getUsers()

        // set the pages according to api
        store.dispatch(CLEAR_DOCS()) // clear documents which may be overwritten by session
        store.dispatch(DELETE_ALL_PAGES())
        const { pageRank, meta } = await this.request.getPages()
        BoardSession.syncPages({ pageRank, meta })

        // fetch data from each page
        pageRank.forEach(async (pageId) => {
            const strokes = await this.request.getStrokes(pageId)
            store.dispatch(ADD_STROKES({ strokes }))
        })
    }

    async createSocket(): Promise<void> {
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
        store.dispatch(CLEAR_DOCS())
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

    sendStrokes(...strokes: Stroke[] | StrokeUpdate[]): void {
        const strokesToSend = strokes
            .map((s) => {
                if (s.id && s.pageId) {
                    const serialized = (s as Stroke).serialize?.()
                    return {
                        ...s,
                        ...serialized,
                        userId: this.user.id, // append the user id to strokes
                    }
                }
                return null
            })
            .filter((s) => s)
        this.send(messages.Stroke, strokesToSend)
    }

    eraseStrokes(...strokes: { id: string; pageId: string }[]): void {
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

    async deletePages(...pageIds: string[]): Promise<void> {
        this.request.deletePages(pageIds)
    }

    async updatePages(clear = false, ...pages: BoardPage[]): Promise<void> {
        this.request.putPages(pages, clear)
    }

    async addAttachment(file: File): Promise<URL> {
        const { attachId } = await this.request.postAttachment(file)
        return this.attachURL(attachId)
    }

    async getAttachment(attachId: string): Promise<[unknown, URL]> {
        const attachData = await this.request.getAttachment(attachId)
        return [attachData, this.attachURL(attachId)]
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
            store.dispatch(ERASE_STROKES({ strokes: erasedStrokes }))
        }

        strokes = strokes.filter((s) => s.type !== 0)
        if (strokes.length > 0) {
            store.dispatch(ADD_STROKES({ strokes }))
        }
    }

    static syncPages({ pageRank, meta }: ResponsePageSync): void {
        if (pageRank.length === 0) {
            store.dispatch(DELETE_ALL_PAGES())
            return
        }
        const { pageCollection } = store.getState().board
        const newPageCollection: PageCollection = {}
        pageRank.forEach((pid: string) => {
            if (Object.prototype.hasOwnProperty.call(pageCollection, pid)) {
                newPageCollection[pid] = pageCollection[pid]
            } else {
                newPageCollection[pid] = new BoardPage().setID(pid)
            }
        })

        store.dispatch(
            SET_PAGERANK({ pageRank, pageCollection: newPageCollection })
        )

        let isLoaded = false
        Object.keys(meta).forEach((pageId) => {
            store.dispatch(SET_PAGEMETA({ pageId, meta: meta[pageId] }))
            const { attachURL } = meta[pageId].background
            if (!isLoaded && attachURL) {
                handleLoadFromSource(attachURL)
                isLoaded = true
            }
        })
    }

    static updatePageMeta({ pageId, meta, clear }: ResponsePageUpdate): void {
        if (clear) {
            pageId.forEach((pid) => store.dispatch(CLEAR_PAGE(pid)))
        }
        pageId.forEach((pid) =>
            store.dispatch(SET_PAGEMETA({ pageId: pid, meta: meta[pid] }))
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
