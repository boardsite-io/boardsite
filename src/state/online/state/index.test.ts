import { PAPER } from "consts"
import { BoardStroke } from "drawing/stroke"
import { LiveStroke } from "drawing/livestroke/index.types"
import { Stroke, ToolType } from "drawing/stroke/index.types"
import { BoardPage } from "drawing/page"
import {
    BoardState,
    PageCollection,
    PageMeta,
} from "state/board/state/index.types"
import { Board } from "state/board"
import { View } from "state/view"
import { ViewState } from "state/view/state/index.types"
import { SessionConfig, User } from "state/online/state/index.types"
import { Request } from "api/request"
import { Message, PageSync, StrokeDelete } from "../../../api/types"
import { Online } from "."

jest.mock("api/request")
const requestMock = Request as jest.MockedClass<typeof Request>
jest.mock("state/board")
const boardStateMock = Board as jest.MockedClass<typeof Board>
jest.mock("state/view")
const viewStateMock = View as jest.MockedClass<typeof View>

const mockConfig: SessionConfig = {
    id: "testId",
    maxUsers: 4,
    host: "userId",
    readOnly: false,
    password: "",
}
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
        paper: PAPER.BLANK,
    },
}

function createOnlineMock(): Online {
    viewStateMock.prototype.getState.mockReturnValue({
        pageIndex: 0,
    } as unknown as ViewState)

    const online = new Online()
    online.setUser(mockUser)
    online.state.session.config = mockConfig
    online.isConnected = () => true
    return online
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
    beforeEach(() => {
        requestMock.mockClear()
        boardStateMock.mockClear()
    })

    it("creates a new session", async () => {
        requestMock.prototype.postSession.mockResolvedValue({
            config: mockConfig,
        })
        const online = createOnlineMock()
        const sessionId = await online.createSession({ password: "" })
        expect(sessionId).toEqual(mockConfig.id)
        expect(online.state.session.config).toEqual(mockConfig)
        expect(requestMock.prototype.postSession).toHaveBeenCalledTimes(1)
    })

    it("joins an existing session", async () => {
        requestMock.prototype.getConfig.mockResolvedValue({
            config: mockConfig,
            users: {
                [mockUser.id ?? ""]: mockUser,
                [newUser.id ?? ""]: newUser,
            },
        })
        requestMock.prototype.getPagesSync.mockResolvedValue({
            pageRank: [],
            pages: {},
        })
        boardStateMock.prototype.getState.mockReturnValue({
            pageCollection: {},
            pageRank: [],
        } as unknown as BoardState)

        const online = createOnlineMock()
        await online.join(false)

        expect(online.state.session.users).toEqual({
            [mockUser.id ?? ""]: mockUser,
            [newUser.id ?? ""]: newUser,
        })
        expect(requestMock.prototype.getConfig).toHaveBeenCalledTimes(1)
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
        boardStateMock.prototype.getState.mockReturnValue({
            pageCollection: {},
            pageRank: [],
        } as unknown as BoardState)
        const online = createOnlineMock()
        await online.join(false)

        expect(boardStateMock.prototype.syncPages).toHaveBeenCalledWith(
            sync.pageRank,
            {
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
            }
        )
    })

    it("is connected if socket is open and sessionId is set", () => {
        const online = createOnlineMock()
        online.state.session.socket = {
            readyState: WebSocket.OPEN,
        } as WebSocket
        expect(online.isConnected()).toBeTruthy()
    })

    it("sends serialized strokes over the socket and remove invalid ones", () => {
        const online = createOnlineMock()
        const strokes: Stroke[] = [
            mockStroke,
            { id: "strokeId2" } as Stroke,
            { pageId: "pageId2" } as Stroke,
        ]
        online.state.session.socket = createMockSocket<Stroke>((data) => {
            expect(data.content.length).toEqual(1)
            expect(data.content[0]).toHaveProperty("userId", mockUser.id)
            expect(data.content[0]).not.toHaveProperty("hitboxes")
            expect(data.content[0]).toEqual({
                ...mockStroke,
                hitboxes: undefined,
                userId: mockUser.id,
            })
        })
        online.sendStrokes(strokes)
    })

    it("sends strokes to be erased over the socket", () => {
        const online = createOnlineMock()
        const strokes: StrokeDelete[] = [mockStroke]
        online.state.session.socket = createMockSocket<StrokeDelete>((data) => {
            expect(data.content.length).toEqual(1)
            expect(data.content[0]).toHaveProperty("id", mockStroke.id)
            expect(data.content[0]).toHaveProperty("pageId", mockStroke.pageId)
            expect(data.content[0]).toHaveProperty("userId", mockUser.id)
            expect(data.content[0]).toHaveProperty("type", ToolType.Eraser)
        })
        online.eraseStrokes(strokes)
    })

    it("updates users on connect and disconnect", () => {
        const online = createOnlineMock()
        online.state.session.users = { [mockUser.id ?? ""]: mockUser }
        online.userConnect(newUser)
        expect(online.state.session.users).toEqual({
            [mockUser.id ?? ""]: mockUser,
            [newUser.id ?? ""]: newUser,
        })
        online.userDisconnect(newUser)
        expect(online.state.session.users).toEqual({
            [mockUser.id ?? ""]: mockUser,
        })
    })

    it("synchronizes pages by deleting and adding pages", async () => {
        const online = createOnlineMock()
        const pageRank = ["pageId"]
        const page = new BoardPage().setID("pageId").updateMeta(mockPageMeta)
        const pageCollection: PageCollection = { [page.pageId]: page }
        boardStateMock.prototype.getState.mockReturnValue({
            pageCollection,
            pageRank,
        } as unknown as BoardState)

        const sync: PageSync = {
            pageRank: ["pageId2"],
            pages: {
                pageId2: {
                    pageId: "pageId2",
                    meta: mockPageMeta,
                },
            },
        }

        await online.syncPages(sync)

        const wantPageRank = ["pageId2"]
        const wantPageCollection = {
            pageId2: new BoardPage().setID("pageId2").updateMeta(mockPageMeta),
        }
        expect(boardStateMock.prototype.syncPages).toHaveBeenCalledWith(
            wantPageRank,
            wantPageCollection
        )
    })

    it("synchronizes pages by updating pages meta", async () => {
        const online = createOnlineMock()
        const pageRank = ["pageId"]
        const page = new BoardPage().setID("pageId")
        const pageCollection: PageCollection = { [page.pageId]: page }
        boardStateMock.prototype.getState.mockReturnValue({
            pageCollection,
            pageRank,
        } as unknown as BoardState)

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

        await online.syncPages(sync)

        const wantPageRank = ["pageId"]
        const wantPageCollection = {
            pageId: new BoardPage().setID("pageId").updateMeta(mockPageMeta),
        }
        expect(boardStateMock.prototype.syncPages).toHaveBeenCalledWith(
            wantPageRank,
            wantPageCollection
        )
    })

    it("synchronizes pages by clearing pages", async () => {
        const online = createOnlineMock()
        const pageRank = ["pageId"]
        const page = new BoardPage()
            .setID("pageId")
            .updateMeta(mockPageMeta)
            .addStrokes([mockStroke])
        const pageCollection: PageCollection = { [page.pageId]: page }
        boardStateMock.prototype.getState.mockReturnValue({
            pageCollection,
            pageRank,
        } as unknown as BoardState)

        const sync: PageSync = {
            pageRank: ["pageId2"],
            pages: {
                pageId2: {
                    pageId: "pageId2",
                    meta: mockPageMeta,
                },
            },
        }

        await online.syncPages(sync)

        const wantPageRank = ["pageId2"]
        const wantPageCollection = {
            pageId2: new BoardPage().setID("pageId2").updateMeta(mockPageMeta),
        }
        expect(boardStateMock.prototype.syncPages).toHaveBeenCalledWith(
            wantPageRank,
            wantPageCollection
        )
    })

    it("updates a user info", async () => {
        const online = createOnlineMock()
        const update = {
            alias: "newUser",
            color: "#ffffff",
        }
        const want: User = {
            id: mockUser.id,
            alias: update.alias,
            color: update.color,
        }
        requestMock.prototype.putUser.mockImplementation(async (update) => {
            expect(update).toEqual(want)
        })

        await online.updateUser(update)
        expect(online.state.user).toEqual(want)
    })

    it("updates only user alias", async () => {
        const online = createOnlineMock()
        const update = {
            alias: "newUser",
        }
        const want: User = {
            id: mockUser.id,
            alias: update.alias,
            color: mockUser.color,
        }
        requestMock.prototype.putUser.mockImplementation(async (update) => {
            expect(update).toEqual(want)
        })

        await online.updateUser(update)
        expect(online.state.user).toEqual(want)
    })

    it("updates a user info throws error", async () => {
        const online = createOnlineMock()
        const update = {
            alias: "newUser",
            color: "#ffffff",
        }
        requestMock.prototype.putUser.mockImplementation(async () => {
            throw new Error("error")
        })

        await expect(online.updateUser(update)).rejects.toThrow()
        expect(online.state.user).toEqual(mockUser)
    })
})
