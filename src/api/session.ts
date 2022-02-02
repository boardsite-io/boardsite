import {
    AttachId,
    AttachType,
    Page,
    PageCollection,
    PageId,
    PageMeta,
} from "redux/board/index.types"
import { Stroke, StrokeUpdate, ToolType } from "drawing/stroke/index.types"
import { Util } from "konva/lib/Util"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"
import store, { ReduxStore } from "redux/store"
import { assign } from "lodash"
import { BoardPage } from "drawing/page"
import { CREATE_SESSION } from "redux/session"
import {
    ADD_ATTACHMENTS,
    ADD_STROKES,
    CLEAR_ATTACHMENTS,
    DELETE_ALL_PAGES,
    ERASE_STROKES,
    SYNC_PAGES,
} from "redux/board"
import { newAttachment } from "drawing/attachment/utils"
import {
    ConnectedUsers,
    Message,
    messages,
    MessageType,
    PageSync,
    SerializedPage,
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
    reduxStore: ReduxStore

    constructor(url?: string, reduxStore?: ReduxStore) {
        this.reduxStore = reduxStore ?? store
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
        return sessionId
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

    async join(copyOffline?: boolean): Promise<void> {
        if (!isConnected) {
            throw new Error("no open websocket")
        }
        this.users = await this.request.getUsers()

        if (copyOffline) {
            // create an online session from the current offline
            const { pageRank, pageCollection } =
                this.reduxStore.getState().board
            await this.synchronize(
                pageRank,
                pageCollection as Record<PageId, Page>
            )
        } else {
            // clear documents which may be overwritten by session
            this.reduxStore.dispatch(CLEAR_ATTACHMENTS())
            // synchronize with the online content
            const sync = await this.request.getPagesSync()
            await this.syncPages(sync)
        }

        if (this.reduxStore.getState().board.pageRank.length === 0) {
            // create a page if there are none yet
            await this.request.postPages([new BoardPage()], [0])
        }
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
        this.reduxStore.dispatch(CLEAR_ATTACHMENTS())
        this.reduxStore.dispatch(DELETE_ALL_PAGES())
    }

    async synchronize(
        pageRank: PageId[],
        pageCollection: Record<PageId, Page>
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
                const { cachedBlob } = store.getState().board.attachments[id]
                const file = new File([cachedBlob], id)
                const { attachId } = await this.request.postAttachment(file)
                mapping.set(id, attachId)
            })
        )

        Object.values(pages).forEach((page) => {
            const { attachId } = page.meta.background
            page.meta.background.attachId = mapping.get(attachId ?? "")
        })

        this.reduxStore.dispatch(DELETE_ALL_PAGES())
        this.reduxStore.dispatch(CLEAR_ATTACHMENTS())

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
        return new URL(
            attachId,
            `${this.apiURL.toString()}b/${this.id}/attachments/`
        )
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
                this.receiveStrokes(message.content as Stroke[])
                break

            case messages.PageSync:
                this.syncPages(message.content as PageSync)
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

    receiveStrokes(strokes: Stroke[]): void {
        const erasedStrokes = strokes.filter((s) => s.type === 0)
        if (erasedStrokes.length > 0) {
            this.reduxStore.dispatch(ERASE_STROKES({ data: erasedStrokes }))
        }

        strokes = strokes.filter((s) => s.type !== 0)
        if (strokes.length > 0) {
            this.reduxStore.dispatch(ADD_STROKES({ data: strokes }))
        }
    }

    async syncPages({ pageRank, pages }: PageSync): Promise<void> {
        const { pageCollection } = this.reduxStore.getState().board
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

        this.reduxStore.dispatch(
            SYNC_PAGES({ pageRank, pageCollection: newPageCollection })
        )
    }

    // loads an attachment into the cache
    async loadAttachment(type: AttachType, id: AttachId): Promise<void> {
        if (this.reduxStore.getState().board.attachments[id]) {
            // already loaded
            return
        }
        const blob = await currentSession().getAttachment(id)
        const attachment = await newAttachment({
            type,
            id,
            cachedBlob: blob,
        }).render()
        this.reduxStore.dispatch(ADD_ATTACHMENTS([attachment]))
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
