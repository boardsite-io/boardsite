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
import { PageId, Paper } from "./index.types"
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
    it("adds a page at the beginning", () => {
        mockBoard.setState(cloneDeep(mockBoardState))

        const page = new BoardPage().setID("mock-pid")
        const index = 0
        const addPageData = [{ page, index }]

        mockBoard.addPages(addPageData)

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
        const addPageData = [{ page, index }]

        mockBoard.addPages(addPageData)

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
        const addPageData = [{ page, index }]

        mockBoard.addPages(addPageData)

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
        const addPageData = [{ page, index }]

        mockBoard.addPages(addPageData)

        expect(mockBoard.getState().pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
            page.pageId,
        ])
        expect(mockBoard.getState().pageCollection[page.pageId]).toEqual(page)
    })

    it("clears all pages", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        mockBoard.clearPages(mockBoardState.pageRank)

        mockBoardState.pageRank.forEach((pid) => {
            expect(mockBoard.getState().pageCollection[pid]?.strokes).toEqual(
                {}
            )
        })
    })

    it("deletes a page", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        mockBoard.deletePages([page1.pageId])

        expect(mockBoard.getState().pageRank).toEqual([
            page2.pageId,
            page3.pageId,
        ])
        expect(
            mockBoard.getState().pageCollection[page1.pageId]
        ).toBeUndefined()
    })

    it("deletes all pages", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        mockBoard.deletePages(mockBoardState.pageRank)

        expect(mockBoard.getState().pageRank).toEqual([])

        mockBoardState.pageRank.forEach((pid) => {
            expect(mockBoard.getState().pageCollection[pid]).toBeUndefined()
        })
    })

    it("updates pages meta", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const newMeta = cloneDeep(page1.meta)
        newMeta.size = PAGE_SIZE.A4_PORTRAIT
        newMeta.background.paper = Paper.Checkered
        const pageUpdate = {
            pageId: page1.pageId,
            meta: newMeta,
        }

        mockBoard.updatePages([pageUpdate])

        expect(mockBoard.getState().pageCollection[page1.pageId]?.meta).toEqual(
            newMeta
        )
    })

    it("adds a stroke", () => {
        mockBoard.setState(cloneDeep(mockBoardState))
        const stroke = getMockStroke(page1.pageId, 1)
        mockBoard.addOrUpdateStrokes([stroke])

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toEqual(stroke)
    })

    it("deletes a stroke", () => {
        const stroke = getMockStroke(page1.pageId)
        mockBoard.setState(cloneDeep(mockBoardState))
        mockBoard.deleteStrokes([stroke])

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
        mockBoard.addOrUpdateStrokes([update])

        expect(
            mockBoard.getState().pageCollection[page1.pageId]?.strokes[
                stroke.id
            ]
        ).toEqual(update)
    })
})
