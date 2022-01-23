import { BoardPage } from "drawing/page"
import { BoardStroke } from "drawing/stroke"
import { Stroke, ToolType } from "drawing/stroke/index.types"
import { cloneDeep } from "lodash"
import {
    DEFAULT_KEEP_CENTERED,
    DEFAULT_STAGE_SCALE,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    backgroundStyle,
    STROKE_WIDTH_PRESETS,
    pageSize,
} from "consts"
import reducer from "./board"
import * as action from "./board"
import {
    AddPages,
    AddStrokes,
    BoardState,
    ClearPages,
    DeletePages,
    EraseStrokes,
    PageId,
    SetPageMeta,
} from "./board.types"

// Mock Strokes
const getMockStroke = (pageId: PageId, i?: number) =>
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
    } as object as Stroke)

// Mock Pages
const [page1, page2, page3] = new Array(3).fill(null).map((_, i) => {
    const pageId = `pid${i + 1}`
    const page = new BoardPage().setID(pageId)
    const mockStroke = getMockStroke(pageId)
    page.strokes[mockStroke.id] = mockStroke
    return page
})

const initialState = {
    currentPageIndex: 0,
    pageRank: [page1.pageId, page2.pageId, page3.pageId],
    pageCollection: {
        [page1.pageId]: page1,
        [page2.pageId]: page2,
        [page3.pageId]: page3,
    },
    attachments: {},
    pageMeta: {
        background: { style: backgroundStyle.BLANK },
        size: {
            width: 10,
            height: 10,
        },
    },
    stage: {
        keepCentered: DEFAULT_KEEP_CENTERED,
        attrs: {
            width: window.innerWidth,
            height: window.innerHeight,
            x: DEFAULT_STAGE_X,
            y: DEFAULT_STAGE_Y,
            scaleX: DEFAULT_STAGE_SCALE,
            scaleY: DEFAULT_STAGE_SCALE,
        },
        renderTrigger: false,
    },
    undoStack: [],
    redoStack: [],
}

describe("board reducer", () => {
    it("correctly handles redoable and non-redoable actions", () => {
        let state: BoardState = cloneDeep(initialState)
        let i = 0
        const getPayload = (isRedoable?: boolean): AddStrokes => ({
            data: [getMockStroke(page1.pageId, i++)],
            isRedoable,
        })

        state = reducer(state, action.ADD_STROKES(getPayload(true)))
        expect(state.undoStack?.length).toEqual(1)
        expect(state.redoStack?.length).toEqual(0)

        state = reducer(state, action.UNDO_ACTION())
        state = reducer(state, action.ADD_STROKES(getPayload(false)))
        expect(state.undoStack?.length).toEqual(0)
        expect(state.redoStack?.length).toEqual(1)

        state = reducer(state, action.ADD_STROKES(getPayload(true)))
        state = reducer(state, action.ADD_STROKES(getPayload(true)))
        expect(state.undoStack?.length).toEqual(2)
        expect(state.redoStack?.length).toEqual(0)
    })

    it("adds a page at the beginning", () => {
        let state: BoardState = cloneDeep(initialState)
        const page = new BoardPage().setID("mock-pid")
        const index = 0
        const payload: AddPages = {
            data: [{ page, index }],
        }

        state = reducer(initialState, action.ADD_PAGES(payload))

        expect(state.pageRank).toEqual([
            page.pageId,
            page1.pageId,
            page2.pageId,
            page3.pageId,
        ])
        expect(state.pageCollection[page.pageId]).toEqual(page)
    })

    it("adds a page at the end", () => {
        let state: BoardState = cloneDeep(initialState)
        const page = new BoardPage().setID("mock-pid")
        const index = -1
        const payload: AddPages = {
            data: [{ page, index }],
        }

        state = reducer(initialState, action.ADD_PAGES(payload))

        expect(state.pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
            page.pageId,
        ])
        expect(state.pageCollection[page.pageId]).toEqual(page)
    })

    it("adds a page in the middle", () => {
        let state: BoardState = cloneDeep(initialState)
        const page = new BoardPage().setID("mock-pid")
        const index = 1
        const payload: AddPages = {
            data: [{ page, index }],
        }

        state = reducer(initialState, action.ADD_PAGES(payload))

        expect(state.pageRank).toEqual([
            page1.pageId,
            page.pageId,
            page2.pageId,
            page3.pageId,
        ])
        expect(state.pageCollection[page.pageId]).toEqual(page)
    })

    it("adds a page with an index that exceeds the valid range", () => {
        let state: BoardState = cloneDeep(initialState)
        const page = new BoardPage().setID("mock-pid")
        const index = 1337
        const payload: AddPages = {
            data: [{ page, index }],
        }

        state = reducer(initialState, action.ADD_PAGES(payload))

        expect(state.pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
            page.pageId,
        ])
        expect(state.pageCollection[page.pageId]).toEqual(page)
    })

    it("adds a page, undos and redos the action", () => {
        let state: BoardState = cloneDeep(initialState)
        const page = new BoardPage().setID("mock-pid")
        const stroke = getMockStroke(page.pageId)
        page.strokes[stroke.id] = stroke
        const index = 1
        const payload: AddPages = {
            data: [{ page, index }],
            isRedoable: true,
        }

        state = reducer(state, action.ADD_PAGES(payload))
        state = reducer(state, action.UNDO_ACTION())

        expect(state.pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
        ])
        expect(state.pageCollection[page.pageId]).toBeUndefined()

        state = reducer(state, action.REDO_ACTION())

        expect(state.pageRank).toEqual([
            page1.pageId,
            page.pageId,
            page2.pageId,
            page3.pageId,
        ])
        expect(state.pageCollection[page.pageId]).toEqual(page)
        expect(state.pageCollection[page.pageId].strokes[stroke.id]).toEqual(
            stroke
        )
    })

    it("clears all pages, undos and redos the action", () => {
        let state: BoardState = cloneDeep(initialState)
        const payload: ClearPages = {
            data: initialState.pageRank,
            isRedoable: true,
        }

        state = reducer(state, action.CLEAR_PAGES(payload))
        initialState.pageRank.forEach((pid) => {
            expect(state.pageCollection[pid].strokes).toEqual({})
        })

        state = reducer(state, action.UNDO_ACTION())
        initialState.pageRank.forEach((pid) => {
            expect(state.pageCollection[pid].strokes[pid]).toEqual(
                getMockStroke(pid)
            )
        })

        state = reducer(state, action.REDO_ACTION())
        initialState.pageRank.forEach((pid) => {
            expect(state.pageCollection[pid].strokes).toEqual({})
        })
    })

    it("deletes a page, undos and redos the action", () => {
        let state: BoardState = cloneDeep(initialState)
        const payload: DeletePages = {
            data: [page1.pageId],
            isRedoable: true,
        }

        state = reducer(state, action.DELETE_PAGES(payload))
        expect(state.pageRank).toEqual([page2.pageId, page3.pageId])
        expect(state.pageCollection[page1.pageId]).toBeUndefined()

        state = reducer(state, action.UNDO_ACTION())
        expect(state.pageRank).toEqual(initialState.pageRank)
        expect(state.pageCollection[page1.pageId]).toEqual(page1)

        state = reducer(state, action.REDO_ACTION())
        expect(state.pageRank).toEqual([page2.pageId, page3.pageId])
        expect(state.pageCollection[page1.pageId]).toBeUndefined()
    })

    it("deletes all pages, undos and redos the action", () => {
        let state: BoardState = cloneDeep(initialState)
        const payload: DeletePages = {
            data: initialState.pageRank,
            isRedoable: true,
        }

        state = reducer(state, action.DELETE_PAGES(payload))
        expect(state.pageRank).toEqual([])
        initialState.pageRank.forEach((pid) => {
            expect(state.pageCollection[pid]).toBeUndefined()
        })

        state = reducer(state, action.UNDO_ACTION())
        expect(state.pageRank).toEqual(initialState.pageRank)
        initialState.pageRank.forEach((pid) => {
            expect(state.pageCollection[pid]).toEqual(
                initialState.pageCollection[pid]
            )
        })

        state = reducer(state, action.REDO_ACTION())
        expect(state.pageRank).toEqual([])
        initialState.pageRank.forEach((pid) => {
            expect(state.pageCollection[pid]).toBeUndefined()
        })
    })

    it("updates pages meta, undos and redos the action", () => {
        let state: BoardState = cloneDeep(initialState)
        const newMeta = cloneDeep(page1.meta)
        newMeta.size = pageSize.square
        newMeta.background.style = backgroundStyle.CHECKERED
        const pageUpdate = {
            pageId: page1.pageId,
            meta: newMeta,
        }
        const payload: SetPageMeta = {
            data: [pageUpdate],
            isRedoable: true,
        }

        state = reducer(state, action.SET_PAGEMETA(payload))
        expect(state.pageCollection[page1.pageId].meta).toEqual(newMeta)

        state = reducer(state, action.UNDO_ACTION())
        expect(state.pageCollection[page1.pageId].meta).toEqual(page1.meta)

        state = reducer(state, action.REDO_ACTION())
        expect(state.pageCollection[page1.pageId].meta).toEqual(newMeta)
    })

    it("adds a stroke, undos and redos the action", () => {
        let state: BoardState = cloneDeep(initialState)
        const stroke = getMockStroke(page1.pageId, 1)
        const payload: AddStrokes = {
            data: [stroke],
            isRedoable: true,
        }

        state = reducer(state, action.ADD_STROKES(payload))
        expect(state.pageCollection[page1.pageId].strokes[stroke.id]).toEqual(
            stroke
        )

        state = reducer(state, action.UNDO_ACTION())
        expect(
            state.pageCollection[page1.pageId].strokes[stroke.id]
        ).toBeUndefined()
        expect(state.pageCollection[page1.pageId].strokes).toEqual(
            page1.strokes
        )

        state = reducer(state, action.REDO_ACTION())
        expect(state.pageCollection[page1.pageId].strokes[stroke.id]).toEqual(
            stroke
        )
    })

    it("deletes a stroke, undos and redos the action", () => {
        let state: BoardState = cloneDeep(initialState)
        const stroke = getMockStroke(page1.pageId)
        const payload: EraseStrokes = {
            data: [stroke],
            isRedoable: true,
        }

        state = reducer(state, action.ERASE_STROKES(payload))
        expect(state.pageCollection[page1.pageId].strokes).toEqual({})

        state = reducer(state, action.UNDO_ACTION())
        expect(state.pageCollection[page1.pageId].strokes[stroke.id]).toEqual(
            stroke
        )
        expect(state.pageCollection[page1.pageId].strokes).toEqual(
            page1.strokes
        )

        state = reducer(state, action.REDO_ACTION())
        expect(state.pageCollection[page1.pageId].strokes).toEqual({})
    })

    it("updates a stroke, undos and redos the action", () => {
        let state: BoardState = cloneDeep(initialState)
        const stroke = getMockStroke(page1.pageId)
        const update = getMockStroke(page1.pageId)
        update.x = 1234
        update.y = 5678
        const payload: AddStrokes = {
            data: [update],
            isUpdate: true,
            isRedoable: true,
        }
        const payloadDelete: EraseStrokes = {
            data: [stroke],
            isRedoable: true,
        }

        // update == delete + add
        state = reducer(state, action.ERASE_STROKES(payloadDelete))
        state = reducer(state, action.ADD_STROKES(payload))
        expect(state.pageCollection[page1.pageId].strokes[stroke.id]).toEqual(
            update
        )

        state = reducer(state, action.UNDO_ACTION())
        expect(state.pageCollection[page1.pageId].strokes[stroke.id]).toEqual(
            stroke
        )

        state = reducer(state, action.REDO_ACTION())
        expect(state.pageCollection[page1.pageId].strokes[stroke.id]).toEqual(
            update
        )
    })
})
