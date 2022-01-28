import { backgroundStyle } from "consts"
import { BoardStroke } from "drawing/stroke"
import { LiveStroke } from "drawing/livestroke/index.types"
import { Stroke, ToolType } from "drawing/stroke/index.types"
import { PageCollection, PageMeta } from "redux/board/index.types"
import { loadIndexedDB } from "redux/localstorage"
import { BoardPage } from "drawing/page"
import store, { ReduxStore } from "redux/store"
import { BoardSession } from "./session"
import { Request } from "./request"
import { Message, PageSync, StrokeDelete, User } from "./types"

jest.mock("./request")
const requestMock = Request as jest.MockedClass<typeof Request>

const mockStore = {
    dispatch: jest.fn(),
    getState: jest.fn(),
}

const mockSessionId = "testId"
const mockUser: User = {
    alias: "user",
    color: "#00ff00",
    id: "userId",
}
const newUser: User = {
    id: "userId2",
    color: "#deadbf",
    alias: "potato",
}
const mockStroke = new BoardStroke({
    id: "strokeId",
    pageId: "pageId",
    type: ToolType.Pen,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    points: [1, 2, 3, 4],
} as LiveStroke)
const mockPageMeta: PageMeta = {
    size: {
        width: 600,
        height: 800,
    },
    background: {
        style: backgroundStyle.BLANK,
    },
}

// TODO: Without the following for some reason fixCreateMockSession throws
// "UnhandledPromiseRejectionWarning: Error: No available storage method found."
;(async () => {
    await loadIndexedDB("board")
})()

function createMockSession(): BoardSession {
    mockStore.getState.mockReset()
    mockStore.dispatch.mockReset()
    // default state
    const pageRank = ["pageId"]
    const page = new BoardPage().setID("pageId")
    const pageCollection: PageCollection = { [page.pageId]: page }
    mockStore.getState.mockReturnValue({
        ...store.getState(),
        board: { ...store.getState().board, pageCollection, pageRank },
    })

    const session = new BoardSession(
        "http://localhost",
        mockStore as unknown as ReduxStore
    )
    session.id = mockSessionId
    session.user = mockUser
    return session
}

function createMockSocket<T>(fn: (data: Message<T[]>) => void): WebSocket {
    return {
        readyState: WebSocket.OPEN,
        send: (data: string) => {
            fn(JSON.parse(data))
        },
    } as WebSocket
}

describe("session", () => {
    beforeEach(() => requestMock.mockClear())

    it("creates a new session", async () => {
        requestMock.prototype.postSession.mockResolvedValue({
            sessionId: mockSessionId,
        })
        const session = new BoardSession("http://localhost")
        const sessionId = await session.create()
        expect(sessionId).toEqual(mockSessionId)
        expect(session.id).toEqual(mockSessionId)
        expect(requestMock.prototype.postSession).toHaveBeenCalledTimes(1)
    })

    it("joins an existing session", async () => {
        requestMock.prototype.getUsers.mockResolvedValue({
            [mockUser.id ?? ""]: mockUser,
            [newUser.id ?? ""]: newUser,
        })
        requestMock.prototype.getPagesSync.mockResolvedValue({
            pageRank: [],
            pages: {},
        })
        const session = createMockSession()

        await session.join(false)

        expect(session.users).toEqual({
            [mockUser.id ?? ""]: mockUser,
            [newUser.id ?? ""]: newUser,
        })
        expect(requestMock.prototype.getUsers).toHaveBeenCalledTimes(1)
        expect(requestMock.prototype.getPagesSync).toHaveBeenCalledTimes(1)
    })

    it("joins a session and synchronizes with online content", async () => {
        const sync: PageSync = {
            pageRank: ["pageId1", "pageId2"],
            pages: {
                pageId1: {
                    pageId: "pageId1",
                    meta: mockPageMeta,
                    strokes: [],
                },
                pageId2: {
                    pageId: "pageId2",
                    meta: mockPageMeta,
                    strokes: [],
                },
            },
        }
        requestMock.prototype.getPagesSync.mockResolvedValue(sync)
        const session = createMockSession()

        await session.join(false)

        expect(mockStore.dispatch).toHaveBeenCalledWith({
            payload: {
                pageRank: sync.pageRank,
                pageCollection: {
                    pageId1: {
                        pageId: "pageId1",
                        meta: mockPageMeta,
                        strokes: {},
                    },
                    pageId2: {
                        pageId: "pageId2",
                        meta: mockPageMeta,
                        strokes: {},
                    },
                },
            },
            type: "board/SET_PAGERANK",
        })
    })

    it("is connected if socket is open and sessionId is set", () => {
        const session = new BoardSession("http://localhost")
        session.id = mockSessionId
        session.socket = { readyState: WebSocket.OPEN } as WebSocket
        expect(session.isConnected()).toBeTruthy()
    })

    it("sends serialized strokes over the socket and remove invalid ones", () => {
        const session = createMockSession()
        const strokes: Stroke[] = [
            mockStroke,
            { id: "strokeId2" } as Stroke,
            { pageId: "pageId2" } as Stroke,
        ]
        session.socket = createMockSocket<Stroke>((data) => {
            expect(data.content.length).toEqual(1)
            expect(data.content[0]).toHaveProperty("userId", mockUser.id)
            expect(data.content[0]).not.toHaveProperty("hitboxes")
            expect(data.content[0]).toEqual({
                ...mockStroke,
                hitboxes: undefined,
                userId: mockUser.id,
            })
        })
        session.sendStrokes(strokes)
    })

    it("sends strokes to be erased over the socket", () => {
        const session = createMockSession()
        const strokes: StrokeDelete[] = [mockStroke]
        session.socket = createMockSocket<StrokeDelete>((data) => {
            expect(data.content.length).toEqual(1)
            expect(data.content[0]).toHaveProperty("id", mockStroke.id)
            expect(data.content[0]).toHaveProperty("pageId", mockStroke.pageId)
            expect(data.content[0]).toHaveProperty("userId", mockUser.id)
            expect(data.content[0]).toHaveProperty("type", ToolType.Eraser)
        })
        session.eraseStrokes(strokes)
    })

    it("updates users on connect and disconnect", () => {
        const session = createMockSession()
        session.users = { [mockUser.id ?? ""]: mockUser }
        session.userConnect(newUser)
        expect(session.users).toEqual({
            [mockUser.id ?? ""]: mockUser,
            [newUser.id ?? ""]: newUser,
        })
        session.userDisconnect(newUser)
        expect(session.users).toEqual({ [mockUser.id ?? ""]: mockUser })
    })

    it("synchronizes pages by deleting and adding pages", async () => {
        const session = createMockSession()
        const pageRank = ["pageId"]
        const page = new BoardPage().setID("pageId").updateMeta(mockPageMeta)
        const pageCollection: PageCollection = { [page.pageId]: page }
        mockStore.getState.mockReturnValue({
            board: { pageCollection, pageRank },
        })

        const sync: PageSync = {
            pageRank: ["pageId2"],
            pages: {
                pageId2: {
                    pageId: "pageId2",
                    meta: mockPageMeta,
                },
            },
        }

        await session.syncPages(sync)

        const wantPageRank = ["pageId2"]
        const wantPageCollection = {
            pageId2: new BoardPage().setID("pageId2").updateMeta(mockPageMeta),
        }
        expect(mockStore.dispatch).toHaveBeenCalledWith({
            payload: {
                pageRank: wantPageRank,
                pageCollection: wantPageCollection,
            },
            type: "board/SET_PAGERANK",
        })
    })

    it("synchronizes pages by updating pages meta", async () => {
        const session = createMockSession()
        const pageRank = ["pageId"]
        const page = new BoardPage().setID("pageId")
        const pageCollection: PageCollection = { [page.pageId]: page }
        mockStore.getState.mockReturnValue({
            board: { pageCollection, pageRank },
        })

        const sync: PageSync = {
            pageRank: ["pageId"],
            pages: {
                pageId: {
                    pageId: "pageId",
                    meta: mockPageMeta,
                    strokes: [],
                },
            },
        }

        await session.syncPages(sync)

        const wantPageRank = ["pageId"]
        const wantPageCollection = {
            pageId: new BoardPage().setID("pageId").updateMeta(mockPageMeta),
        }
        expect(mockStore.dispatch).toHaveBeenCalledWith({
            payload: {
                pageRank: wantPageRank,
                pageCollection: wantPageCollection,
            },
            type: "board/SET_PAGERANK",
        })
    })

    it("synchronizes pages by clearing pages", async () => {
        const session = createMockSession()
        const pageRank = ["pageId"]
        const page = new BoardPage()
            .setID("pageId")
            .updateMeta(mockPageMeta)
            .addStrokes([mockStroke])
        const pageCollection: PageCollection = { [page.pageId]: page }
        mockStore.getState.mockReturnValue({
            board: { pageCollection, pageRank },
        })

        const sync: PageSync = {
            pageRank: ["pageId2"],
            pages: {
                pageId2: {
                    pageId: "pageId2",
                    meta: mockPageMeta,
                },
            },
        }

        await session.syncPages(sync)

        const wantPageRank = ["pageId2"]
        const wantPageCollection = {
            pageId2: new BoardPage().setID("pageId2").updateMeta(mockPageMeta),
        }
        expect(mockStore.dispatch).toHaveBeenCalledWith({
            payload: {
                pageRank: wantPageRank,
                pageCollection: wantPageCollection,
            },
            type: "board/SET_PAGERANK",
        })
    })
})
