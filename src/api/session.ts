import { Stroke, StrokeUpdate, ToolType } from "drawing/stroke/index.types"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"
import { assign } from "lodash"
import { BoardPage } from "drawing/page"
import { newAttachment } from "drawing/attachment/utils"
import { board } from "state/board"
import {
    AttachId,
    AttachType,
    Page,
    PageCollection,
    PageId,
    PageMeta,
} from "state/board/state/index.types"
import { getRandomColor } from "helpers"
import {
    ConnectedUsers,
    Message,
    MessageType,
    PageSync,
    SerializedPage,
    Session,
    SessionConfig,
    StrokeDelete,
    User,
} from "./types"
import { API_URL, Request } from "./request"
import { online } from "../state/online"

export class BoardSession implements Session {
    config?: SessionConfig
    secret?: string
    user: User
    request: Request
    socket?: WebSocket
    users?: ConnectedUsers

    constructor() {
        this.request = new Request()
        this.user = {
            alias: uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: "",
                style: "capital",
            }),
            color: getRandomColor(),
        }
    }

    setToken(token: string): void {
        this.request.token = token
    }

    updateUser(user: Partial<User>): void {
        assign(this.user, user)
    }

    async create(): Promise<string> {
        const { config } = await this.request.postSession()
        this.config = config
        this.request = new Request(config.id)
        return config.id
    }

    async createSocket(sessionId: string): Promise<void> {
        this.request = new Request(sessionId)
        // create a new user for us
        const { id } = await this.request.postUser(this.user)
        this.user.id = id

        return new Promise((resolve, reject) => {
            const url = new URL(API_URL)
            url.protocol = url.protocol.replace("http", "ws")
            this.socket = new WebSocket(
                `${url.toString()}b/${sessionId}/users/${this.user.id}/socket`
            )
            this.socket.onmessage = (msg) => this.receive(JSON.parse(msg.data))
            this.socket.onopen = () => resolve()
            this.socket.onerror = (ev) => reject(ev)
        })
    }

    async join(copyOffline?: boolean): Promise<void> {
        if (!isConnected) {
            throw new Error("no open websocket")
        }
        const { users, config } = await this.request.getConfig()
        this.users = users
        this.config = config

        if (copyOffline) {
            // create an online session from the current offline
            const { pageRank, pageCollection } = board.getState()
            await this.synchronize(pageRank, pageCollection)
        } else {
            // clear documents which may be overwritten by session
            board.clearAttachments()
            // synchronize with the online content
            const sync = await this.request.getPagesSync()
            await this.syncPages(sync)
        }

        if (board.getState().pageRank.length === 0) {
            // create a page if there are none yet
            await this.request.postPages([new BoardPage()], [0])
        }

        online.render("session")
    }

    isConnected(): boolean {
        return (
            this.config?.id !== "" &&
            this.socket != null &&
            this.socket?.readyState === WebSocket.OPEN
        )
    }

    isHost(): boolean {
        return this.user.id === this.config?.host
    }

    disconnect(): void {
        this.socket?.close()
        this.users = {}
        board.clearAttachments()
        board.deleteAllPages()
        board.addPages({ data: [{ page: new BoardPage(), index: -1 }] })
        online.render("session")
    }

    async synchronize(
        pageRank: PageId[],
        pageCollection: PageCollection
    ): Promise<void> {
        const pages = Object.values(pageCollection).reduce<
            Record<PageId, SerializedPage>
        >(
            (pages, page) => ({
                ...pages,
                [page.pageId]: {
                    pageId: page.pageId,
                    meta: page.meta,
                    strokes: Object.values(page.strokes).map((s) =>
                        s.serialize()
                    ),
                },
            }),
            {}
        )

        // attachments that need to be uploaded
        // defines a mapping from old (local) attachId
        // to new (shared) attachId
        const mapping = new Map<string, string>()
        Object.values(pageCollection)
            .map((page) => page.meta.background.attachId)
            .filter((attachId) => attachId)
            .forEach((attachId) => {
                mapping.set(attachId as string, "")
            })

        await Promise.all(
            new Array(...mapping.keys()).map(async (id) => {
                const { cachedBlob } = board.getState().attachments[id]
                const file = new File([cachedBlob], id)
                const { attachId } = await this.request.postAttachment(file)
                mapping.set(id, attachId)
            })
        )

        Object.values(pages).forEach((page) => {
            const { attachId } = page.meta.background
            page.meta.background.attachId = mapping.get(attachId ?? "")
        })

        board.deleteAllPages()
        board.clearAttachments()

        const sync: PageSync = {
            pageRank,
            pages,
        }
        return this.request.postPagesSync(sync)
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
        this.send(MessageType.Stroke, strokesToSend)
    }

    eraseStrokes(strokes: StrokeDelete[]): void {
        this.send(
            MessageType.Stroke,
            strokes.map((s) => ({
                id: s.id,
                pageId: s.pageId,
                type: ToolType.Eraser,
                userId: this.user.id,
            }))
        )
    }

    addPages(pages: BoardPage[], pageIndex: number[]): Promise<void> {
        return this.request.postPages(pages, pageIndex)
    }

    deletePages(pageIds: string[]): Promise<void> {
        return this.request.deletePages(pageIds)
    }

    updatePages(
        pages: Pick<Page, "pageId" | "meta">[],
        clear = false
    ): Promise<void> {
        if (clear) {
            return this.request.clearPages(pages.map((page) => page.pageId))
        }

        return this.request.updatePagesMeta(
            pages.reduce<Record<PageId, PageMeta>>(
                (pages, page) => ({ ...pages, [page.pageId]: page.meta }),
                {}
            )
        )
    }

    async addAttachment(file: File): Promise<string> {
        const { attachId } = await this.request.postAttachment(file)
        return attachId
    }

    getAttachment(attachId: string): Promise<Uint8Array> {
        return this.request.getAttachment(attachId)
    }

    attachURL(attachId: string): URL {
        return new URL(attachId, `${API_URL}/b/${this.config?.id}/attachments/`)
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

    async updateConfig(config: Partial<SessionConfig>): Promise<void> {
        if (!this.secret) return
        await this.request.putConfig(this.secret, config)
    }

    receive(message: Message<unknown>): void {
        switch (message.type) {
            case MessageType.Stroke:
                this.receiveStrokes(message.content as Stroke[])
                break

            case MessageType.PageSync:
                this.syncPages(message.content as PageSync)
                break

            case MessageType.UserHost:
                this.secret = (message.content as any).secret
                break

            case MessageType.UserConnected:
                this.userConnect(message.content as User)
                break

            case MessageType.UserDisconnected:
                this.userDisconnect(message.content as User)
                break

            case MessageType.Config:
                this.config = (message.content as any).config
                break

            default:
                break
        }
        online.render("session")
    }

    // TODO
    // eslint-disable-next-line class-methods-use-this
    receiveStrokes(strokes: Stroke[]): void {
        const erasedStrokes = strokes.filter((s) => s.type === 0)
        if (erasedStrokes.length > 0) {
            board.eraseStrokes({ data: erasedStrokes })
        }

        strokes = strokes.filter((s) => s.type !== 0)

        if (strokes.length > 0) {
            board.addStrokes({ data: strokes })
        }
    }

    async syncPages({ pageRank, pages }: PageSync): Promise<void> {
        const { pageCollection } = board.getState()
        const newPageCollection: Record<string, Page> = {}
        for (let i = 0; i < pageRank.length; i++) {
            const pid = pageRank[i]
            const localPageState = pageCollection[pid]

            if (localPageState) {
                newPageCollection[pid] = localPageState
            } else {
                newPageCollection[pid] = new BoardPage().setID(pid)
            }

            // stroke update to sync
            const strokes = pages[pid]?.strokes
            if (strokes !== undefined) {
                if (strokes.length === 0) {
                    // page clear
                    newPageCollection[pid].strokes = {}
                } else {
                    newPageCollection[pid].addStrokes(strokes)
                }
            }

            // page meta update to sync
            if (pages[pid]?.meta) {
                newPageCollection[pid].updateMeta(pages[pid].meta)

                // if the background is based on an attachment load it
                const { attachId } = pages[pid].meta.background
                if (attachId) {
                    await this.loadAttachment(AttachType.PDF, attachId)
                }
            }
        }

        board.syncPages(pageRank, newPageCollection)
    }

    // loads an attachment into the cache
    // eslint-disable-next-line class-methods-use-this
    async loadAttachment(type: AttachType, id: AttachId): Promise<void> {
        if (board.getState().attachments[id]) {
            // already loaded
            return
        }
        const blob = await currentSession().getAttachment(id)
        const attachment = await newAttachment({
            type,
            id,
            cachedBlob: blob,
        }).render()
        board.addAttachments([attachment])
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
    let { session } = online.getState()
    if (!session) {
        session = new BoardSession()
        online.setSession(session)
    }
    return session
}

export const isConnected = (): boolean => {
    const { session } = online.getState()
    return session !== undefined && session.isConnected()
}
