import { BoardPage } from "drawing/page"
import { BoardStroke } from "drawing/stroke"
import { SerializedStroke, ToolType } from "drawing/stroke/index.types"
import { cloneDeep } from "lodash"
import {
    DEFAULT_KEEP_CENTERED,
    STROKE_WIDTH_PRESETS,
    PAGE_SIZE,
    DEFAULT_VIEW_TRANSFORM,
} from "consts"
import {
    AddPagesAction,
    AddStrokesAction,
    ClearPagesAction,
    DeletePagesAction,
    EraseStrokesAction,
    PageId,
    Paper,
    SetPageMetaAction,
} from "./index.types"
import { Board } from "."

// Mock Strokes
export const getMockStroke = (pageId: PageId, i?: number) =>
    new BoardStroke({
        id: `${pageId}${i ?? ""}`,
        pageId,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        points: [],
        type: ToolType.Pen,
        style: {
            color: "#00ff00",
            width: STROKE_WIDTH_PRESETS[3],
            opacity: 1,
        },
    } as SerializedStroke)

// Mock Pages
const [page1, page2, page3] = new Array(3).fill(null).map((_, i) => {
    const pageId = `pid${i + 1}`
    const page = new BoardPage().setID(pageId)
    const mockStroke = getMockStroke(pageId)
    page.strokes[mockStroke.id] = mockStroke
    return page
})

export const mockBoardState = {
    currentPageIndex: 0,
    pageRank: [page1.pageId, page2.pageId, page3.pageId],
    pageCollection: {
        [page1.pageId]: page1,
        [page2.pageId]: page2,
        [page3.pageId]: page3,
    },
    attachments: {},
    pageMeta: {
        background: { style: Paper.Blank },
        size: {
            width: 10,
            height: 10,
        },
    },
    view: {
        keepCentered: DEFAULT_KEEP_CENTERED,
        transform: DEFAULT_VIEW_TRANSFORM,
        renderTrigger: false,
    },
    undoStack: [],
    redoStack: [],
}

const mockBoard = new Board()

describe("board reducer", () => {
    it("correctly handles redoable and non-redoable actions", () => {
        mockBoard.setState(cloneDeep(mockBoardState))

        let i = 0
        const getPayload = (isRedoable?: boolean): AddStrokesAction => ({
            data: [getMockStroke(page1.pageId, i++)],
            isRedoable,
        })

        mockBoard.handleAddStrokes(getPayload(true))
        expect(mockBoard.getState().undoStack?.length).toEqual(1)
        expect(mockBoard.getState().redoStack?.length).toEqual(0)

        mockBoard.undoAction()
        mockBoard.handleAddStrokes(getPayload(false))
        expect(mockBoard.getState().undoStack?.length).toEqual(0)
        expect(mockBoard.getState().redoStack?.length).toEqual(1)

        mockBoard.handleAddStrokes(getPayload(true))
        mockBoard.handleAddStrokes(getPayload(true))
        expect(mockBoard.getState().undoStack?.length).toEqual(2)
        expect(mockBoard.getState().redoStack?.length).toEqual(0)
    })

    it("adds a page at the beginning", () => {
        mockBoard.setState(cloneDeep(mockBoardState))

        const page = new BoardPage().setID("mock-pid")
        const index = 0
        const pagesAction: AddPagesAction = {
            data: [{ page, index }],
        }

        mockBoard.handleAddPages(pagesAction)

        expect(mockBoard.getState().pageRank).toEqual([
            page.pageId,
            page1.pageId,
            page2.pageId,
            page3.pageId,
        ])
        expect(mockBoard.getState().pageCollection[page.pageId]).toEqual(page)
    })

    it("adds a page at the end", () => {
        mockBoard.setState(cloneDeep(mockBoardState))

        const page = new BoardPage().setID("mock-pid")
        const index = -1
        const pagesAction: AddPagesAction = {
            data: [{ page, index }],
        }

        mockBoard.handleAddPages(pagesAction)

        expect(mockBoard.getState().pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
            page.pageId,
        ])
        expect(mockBoard.getState().pageCollection[page.pageId]).toEqual(page)
    })

    it("adds a page in the middle", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const page = new BoardPage().setID("mock-pid")
        const index = 1
        const pagesAction: AddPagesAction = {
            data: [{ page, index }],
        }

        mockBoard.handleAddPages(pagesAction)

        expect(mockBoard.getState().pageRank).toEqual([
            page1.pageId,
            page.pageId,
            page2.pageId,
            page3.pageId,
        ])
        expect(mockBoard.getState().pageCollection[page.pageId]).toEqual(page)
    })

    it("adds a page with an index that exceeds the valid range", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const page = new BoardPage().setID("mock-pid")
        const index = 1337
        const pagesAction: AddPagesAction = {
            data: [{ page, index }],
        }

        mockBoard.handleAddPages(pagesAction)

        expect(mockBoard.getState().pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
            page.pageId,
        ])
        expect(mockBoard.getState().pageCollection[page.pageId]).toEqual(page)
    })

    it("adds a page, undos and redos the action", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const page = new BoardPage().setID("mock-pid")
        const stroke = getMockStroke(page.pageId)
        page.strokes[stroke.id] = stroke
        const index = 1
        const pagesAction: AddPagesAction = {
            data: [{ page, index }],
            isRedoable: true,
        }

        mockBoard.handleAddPages(pagesAction)
        mockBoard.undoAction()

        expect(mockBoard.getState().pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
        ])
        expect(mockBoard.getState().pageCollection[page.pageId]).toBeUndefined()

        mockBoard.redoAction()

        expect(mockBoard.getState().pageRank).toEqual([
            page1.pageId,
            page.pageId,
            page2.pageId,
            page3.pageId,
        ])
        expect(mockBoard.getState().pageCollection[page.pageId]).toEqual(page)
        expect(
            mockBoard.getState().pageCollection[page.pageId]?.strokes[stroke.id]
        ).toEqual(stroke)
    })

    it("clears all pages, undos and redos the action", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const clearPagesAction: ClearPagesAction = {
            data: mockBoardState.pageRank,
            isRedoable: true,
        }

        mockBoard.handleClearPages(clearPagesAction)

        mockBoardState.pageRank.forEach((pid) => {
            expect(mockBoard.getState().pageCollection[pid]?.strokes).toEqual(
                {}
            )
        })

        mockBoard.undoAction()

        mockBoardState.pageRank.forEach((pid) => {
            expect(
                mockBoard.getState().pageCollection[pid]?.strokes[pid]
            ).toEqual(getMockStroke(pid))
        })

        mockBoard.redoAction()

        mockBoardState.pageRank.forEach((pid) => {
            expect(mockBoard.getState().pageCollection[pid]?.strokes).toEqual(
                {}
            )
        })
    })

    it("deletes a page, undos and redos the action", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const deletePagesAction: DeletePagesAction = {
            data: [page1.pageId],
            isRedoable: true,
        }

        mockBoard.handleDeletePages(deletePagesAction)

        expect(mockBoard.getState().pageRank).toEqual([
            page2.pageId,
            page3.pageId,
        ])
        expect(
            mockBoard.getState().pageCollection[page1.pageId]
        ).toBeUndefined()

        mockBoard.undoAction()

        expect(mockBoard.getState().pageRank).toEqual(mockBoardState.pageRank)
        expect(mockBoard.getState().pageCollection[page1.pageId]).toEqual(page1)

        mockBoard.redoAction()

        expect(mockBoard.getState().pageRank).toEqual([
            page2.pageId,
            page3.pageId,
        ])
        expect(
            mockBoard.getState().pageCollection[page1.pageId]
        ).toBeUndefined()
    })

    it("deletes all pages, undos and redos the action", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const deletePagesAction: DeletePagesAction = {
            data: mockBoardState.pageRank,
            isRedoable: true,
        }

        mockBoard.handleDeletePages(deletePagesAction)

        expect(mockBoard.getState().pageRank).toEqual([])

        mockBoardState.pageRank.forEach((pid) => {
            expect(mockBoard.getState().pageCollection[pid]).toBeUndefined()
        })

        mockBoard.undoAction()

        expect(mockBoard.getState().pageRank).toEqual(mockBoardState.pageRank)
        mockBoardState.pageRank.forEach((pid) => {
            expect(mockBoard.getState().pageCollection[pid]).toEqual(
                mockBoardState.pageCollection[pid]
            )
        })

        mockBoard.redoAction()

        expect(mockBoard.getState().pageRank).toEqual([])
        mockBoardState.pageRank.forEach((pid) => {
            expect(mockBoard.getState().pageCollection[pid]).toBeUndefined()
        })
    })

    it("updates pages meta, undos and redos the action", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const newMeta = cloneDeep(page1.meta)
        newMeta.size = PAGE_SIZE.A4_PORTRAIT
        newMeta.background.paper = Paper.Checkered
        const pageUpdate = {
            pageId: page1.pageId,
            meta: newMeta,
        }
        const setPageMetaAction: SetPageMetaAction = {
            data: [pageUpdate],
            isRedoable: true,
        }

        mockBoard.handleSetPageMeta(setPageMetaAction)

        expect(mockBoard.getState().pageCollection[page1.pageId]?.meta).toEqual(
            newMeta
        )

        mockBoard.undoAction()

        expect(mockBoard.getState().pageCollection[page1.pageId]?.meta).toEqual(
            page1.meta
        )

        mockBoard.redoAction()

        expect(mockBoard.getState().pageCollection[page1.pageId]?.meta).toEqual(
            newMeta
        )
    })

    it("adds a stroke, undos and redos the action", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const stroke = getMockStroke(page1.pageId, 1)
        const addStrokesAction: AddStrokesAction = {
            data: [stroke],
            isRedoable: true,
        }

        mockBoard.handleAddStrokes(addStrokesAction)

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toEqual(stroke)

        mockBoard.undoAction()

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toBeUndefined()
        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes
        ).toEqual(page1.strokes)

        mockBoard.redoAction()

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toEqual(stroke)
    })

    it("deletes a stroke, undos and redos the action", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const stroke = getMockStroke(page1.pageId)
        const eraseStrokesAction: EraseStrokesAction = {
            data: [stroke],
            isRedoable: true,
        }

        mockBoard.handleEraseStrokes(eraseStrokesAction)

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes
        ).toEqual({})

        mockBoard.undoAction()

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toEqual(stroke)
        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes
        ).toEqual(page1.strokes)

        mockBoard.redoAction()

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes
        ).toEqual({})
    })

    it("updates a stroke, undos and redos the action", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const stroke = getMockStroke(page1.pageId)
        const update = getMockStroke(page1.pageId)
        update.x = 1234
        update.y = 5678
        const addStrokesAction: AddStrokesAction = {
            data: [update],
            isUpdate: true,
            isRedoable: true,
        }
        const eraseStrokesAction: EraseStrokesAction = {
            data: [stroke],
            isRedoable: true,
        }

        // update == delete + add
        mockBoard.handleEraseStrokes(eraseStrokesAction)
        mockBoard.handleAddStrokes(addStrokesAction)

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toEqual(update)

        mockBoard.undoAction()

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toEqual(stroke)

        mockBoard.redoAction()

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toEqual(update)
    })
})
