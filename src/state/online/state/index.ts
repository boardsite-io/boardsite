import { validateToken } from "api/auth"
import { API_URL, request } from "api/request"
import { subscriptionState } from "state/subscription"
import {
    ConfigMessage,
    Message,
    MessageType,
    PageSync,
    SerializedPage,
    StrokeDelete,
    UserHost,
} from "api/types"
import { notification } from "state/notification"
import { Stroke, StrokeUpdate, ToolType } from "drawing/stroke/index.types"
import { board } from "state/board"
import {
    AttachId,
    AttachType,
    Page,
    PageCollection,
    PageId,
    PageMeta,
} from "state/board/state/index.types"
import { BoardPage } from "drawing/page"
import { menu } from "state/menu"
import { view } from "state/view"
import { DialogState } from "state/menu/state/index.types"
import { newAttachment } from "drawing/attachment/utils"
import { OnlineState, SessionConfig, User } from "./index.types"
import { GlobalState } from "../../types"
import { OnlineSerializer } from "../serializers"

export class Online
    extends OnlineSerializer
    implements GlobalState<OnlineState>
{
    getState(): OnlineState {
        return this.state
    }

    setState(newState: OnlineState) {
        this.state = newState
        return this
    }

    override async loadFromLocalStorage(): Promise<OnlineState> {
        const state = await super.loadFromLocalStorage()

        // Load preferred user settings
        if (state.user) {
            request.userId = state.user.id
        }

        // dont erase an existing token
        if (state.token) {
            await this.setToken(state.token)
        }

        return state
    }

    isConnected(): boolean {
        return (
            this.state.session.config?.id !== "" &&
            this.state.session.socket != null &&
            this.state.session.socket?.readyState === WebSocket.OPEN
        )
    }

    isAuthorized(): boolean {
        return this.state.isAuthorized
    }

    isSignedIn(): boolean {
        return !!this.state.token
    }

    isHost(): boolean {
        return this.state.user.id === this.state.session.config?.host
    }

    isReadOnly(): boolean {
        return !this.isHost() && !!this.state.session?.config?.readOnly
    }

    async updateConfig(config: Partial<SessionConfig>): Promise<void> {
        if (!this.state.session.secret) return
        await request.putConfig(this.state.session.secret, config)
    }

    /**
     * Update the local user settings, such as alias and color
     * @param user an update to the user selection
     */
    setUser(user: Partial<User>): void {
        this.state.user = {
            ...this.state.user,
            ...user,
        }
        this.saveToLocalStorage()
    }

    /**
     * Update user properties, such as alias and color, in an online session
     * @param user partial properties for update
     */
    async updateUser(user: Partial<User>): Promise<void> {
        const updatedUser: User = {
            id: this.state.user.id,
            alias: user.alias ?? this.state.user.alias,
            color: user.color ?? this.state.user.color,
        }
        await request.putUser(updatedUser)
        this.state.user = updatedUser
    }

    /**
     * Set the github authorization token
     * @param token authorization token
     */
    async setToken(token: string): Promise<void> {
        this.state.isAuthorized = await validateToken(token)
        this.state.token = token
        request.token = token
        this.saveToLocalStorage()
        subscriptionState.render("Session")
    }

    /**
     * Clear the github authorization token
     */
    clearToken(): void {
        this.setToken("")
        this.saveToLocalStorage()
    }

    async createSession(createConfig: Partial<SessionConfig>): Promise<string> {
        const { config } = await request.postSession(createConfig)
        this.state.session.config = config
        request.setSessionId(config.id)
        return config.id
    }

    async createSocket(sessionId: string, password?: string): Promise<void> {
        request.setSessionId(sessionId)
        try {
            // first check if we can connect with an already existing userId
            await this.connectWebsocket(sessionId)
        } catch {
            // create a new user for us
            const { id } = await request.postUser(this.state.user, password)
            this.state.user.id = id
            await this.connectWebsocket(sessionId)
        }
    }

    private async connectWebsocket(sessionId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const url = new URL(API_URL)
            url.protocol = url.protocol.replace("http", "ws")

            const webSocket = new WebSocket(
                `${url.toString()}b/${sessionId}/users/${
                    this.state.user.id
                }/socket`
            )
            webSocket.onmessage = (msg) => this.receive(JSON.parse(msg.data))
            webSocket.onopen = () => {
                this.isActivelyDisconnecting = false
                resolve()
            }
            webSocket.onerror = (ev) => {
                this.isActivelyDisconnecting = true
                reject(ev)
            }
            webSocket.onclose = () => {
                if (!this.isActivelyDisconnecting) {
                    // Open join dialog to allow easy rejoining in case of passive websocket disconnect
                    menu.setDialogState(DialogState.OnlineJoin)
                    notification.create(
                        "Notification.Session.Disconnected",
                        5000
                    )
                    this.disconnectCleanUp()
                }
                this.isActivelyDisconnecting = false
            }

            this.state.session.socket = webSocket
        })
    }

    /**
     * Indicate if a websocket disconnect has been triggered actively
     */
    isActivelyDisconnecting = false

    disconnect(): void {
        this.isActivelyDisconnecting = true
        this.state.session.socket?.close()

        // Trigger notification and dialog update here because the onclose event  is delayed
        this.disconnectCleanUp()
        // The initialSelection dialog navigates to the home route on mount
        menu.setDialogState(DialogState.InitialSelection)
    }

    /**
     * Clear board state and update session UI
     */
    private disconnectCleanUp(): void {
        board.fullReset() // Use non-redoable internal option
        board.handleAddPages({
            data: [{ page: new BoardPage(), index: -1 }],
        })

        delete this.state.session.users
        delete this.state.session.socket
        subscriptionState.render("Session")

        board.localStoreEnabled = true
    }

    async join(copyOffline?: boolean): Promise<void> {
        if (!this.isConnected()) {
            throw new Error("no open websocket")
        }
        const { users, config } = await request.getConfig()
        this.state.session.users = users
        this.state.session.config = config

        // board state is now managed by session
        board.localStoreEnabled = false

        if (copyOffline) {
            // create an online session from the current offline
            const { pageRank, pageCollection } = board.getState()
            await this.synchronize(pageRank, pageCollection)
        } else {
            // clear documents which may be overwritten by session
            board.clearAttachments()
            // synchronize with the online content
            const sync = await request.getPagesSync()
            await this.syncPages(sync)
        }

        if (board.getState().pageRank.length === 0) {
            // create a page if there are none yet
            await request.postPages([new BoardPage()], [0])
        }

        subscriptionState.render("Session")
    }

    send(type: MessageType, content: unknown): void {
        const message: Message<typeof content> = {
            type,
            sender: this.state.user.id as string,
            content,
        }
        this.state.session.socket?.send(JSON.stringify(message))
    }

    sendStrokes(strokes: Stroke[] | StrokeUpdate[]): void {
        const strokesToSend = strokes
            .map((s) => {
                if (s.id && s.pageId) {
                    const serialized = (s as Stroke).serialize?.()
                    return {
                        ...serialized,
                        userId: this.state.user.id, // append the user id to strokes
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
                userId: this.state.user.id,
            }))
        )
    }

    attachURL(attachId: string): URL {
        return new URL(
            attachId,
            `${API_URL}/b/${this.state.session.config?.id}/attachments/`
        )
    }

    userConnect(user: User): void {
        this.state.session.users = {
            ...this.state.session.users,
            [user.id as string]: user,
        }
    }

    userSync(users: Record<string, User>): void {
        this.state.session.users = users
    }

    userDisconnect({ id }: User): void {
        delete this.state.session.users?.[id as string]
    }

    async kickUser({ id }: Pick<User, "id">): Promise<void> {
        if (!this.state.session.secret) return
        if (!id) return
        await request.putKickUser(this.state.session.secret, id)
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
                this.state.session.secret = (message.content as UserHost).secret
                break

            case MessageType.UserConnected:
                this.userConnect(message.content as User)
                break

            case MessageType.UserSync:
                this.userSync(message.content as Record<string, User>)
                break

            case MessageType.UserDisconnected:
                this.userDisconnect(message.content as User)
                break

            case MessageType.UserKick:
                notification.create("Notification.Session.UserKicked", 3000)
                this.disconnect()
                break

            case MessageType.Config:
                this.state.session.config = (
                    message.content as ConfigMessage
                ).config
                break

            default:
                break
        }
        subscriptionState.render("Session")
    }

    // eslint-disable-next-line class-methods-use-this
    receiveStrokes(strokes: Stroke[]): void {
        const erasedStrokes = strokes.filter((s) => s.type === 0)
        if (erasedStrokes.length > 0) {
            board.handleEraseStrokes({ data: erasedStrokes })
        }

        strokes = strokes.filter((s) => s.type !== 0)

        if (strokes.length > 0) {
            board.handleAddStrokes({ data: strokes })
        }
    }

    getNumberOfUsers(): number {
        return Object.keys(this.state.session.users ?? {}).length
    }

    async synchronize(
        pageRank: PageId[],
        pageCollection: PageCollection
    ): Promise<void | null> {
        if (!this.isConnected()) return null

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
                const { attachId } = await request.postAttachment(file)
                mapping.set(id, attachId)
            })
        )

        Object.values(pages).forEach((page) => {
            const { attachId } = page.meta.background
            page.meta.background.attachId = mapping.get(attachId ?? "")
        })

        board.fullReset()
        board.clearAttachments()

        const sync: PageSync = {
            pageRank,
            pages,
        }
        return request.postPagesSync(sync)
    }

    async addPages(
        pages: BoardPage[],
        pageIndex: number[]
    ): Promise<void | null> {
        if (!this.isConnected()) return null

        return request.postPages(pages, pageIndex)
    }

    async deletePages(pageIds: string[]): Promise<void | null> {
        if (!this.isConnected()) return null
        return request.deletePages(pageIds)
    }

    async updatePages(
        pages: Pick<Page, "pageId" | "meta">[],
        clear = false
    ): Promise<void | null> {
        if (!this.isConnected()) return null

        if (clear) {
            return request.clearPages(pages.map((page) => page.pageId))
        }

        return request.updatePagesMeta(
            pages.reduce<Record<PageId, PageMeta>>(
                (pages, page) => ({ ...pages, [page.pageId]: page.meta }),
                {}
            )
        )
    }

    async syncPages({ pageRank, pages }: PageSync): Promise<void> {
        if (!this.isConnected()) return

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

        // Adjust view if necessary
        if (pageRank.length && view.getPageIndex() > pageRank.length - 1) {
            view.setPageIndex(pageRank.length - 1)
        }

        board.syncPages(pageRank, newPageCollection)
    }

    // loads an attachment into the cache
    async loadAttachment(type: AttachType, id: AttachId): Promise<void> {
        if (!this.isConnected()) return

        if (board.getState().attachments[id]) {
            // already loaded
            return
        }
        const blob = await request.getAttachment(id)

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

export const online = new Online()
