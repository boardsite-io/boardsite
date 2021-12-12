import { BoardPage } from "drawing/page"
import { BoardStroke } from "drawing/stroke"
import { Stroke, ToolType } from "drawing/stroke/index.types"
import {
    DEFAULT_HIDE_NAVBAR,
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

// Mock Pages
const page1 = new BoardPage().setID("pid1").updateMeta({
    background: { style: backgroundStyle.CHECKERED },
    size: pageSize.a4landscape,
})
const page2 = new BoardPage().setID("pid2").updateMeta({
    background: { style: backgroundStyle.RULED },
    size: pageSize.a4portrait,
})
const page3 = new BoardPage().setID("pid3").updateMeta({
    background: { style: backgroundStyle.BLANK },
    size: pageSize.square,
})
const page4 = new BoardPage().setID("pid4").updateMeta({
    background: { style: backgroundStyle.RULED },
    size: pageSize.a4portrait,
})

// Mock Strokes
const mockStroke1 = {
    id: "strkid1",
    pageId: "pid1",
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
} as object as Stroke
const mockBoardStroke1 = new BoardStroke(mockStroke1)

page1.strokes.strkid1 = mockBoardStroke1

const mockState1 = {
    currentPageIndex: 0,
    pageRank: [page1.pageId, page2.pageId, page3.pageId, page4.pageId],
    pageCollection: {
        [page1.pageId]: page1,
        [page2.pageId]: page2,
        [page3.pageId]: page3,
        [page4.pageId]: page4,
    },
    documentImages: [],
    documentSrc: "",
    pageMeta: {
        background: { style: backgroundStyle.BLANK },
        size: {
            width: 10,
            height: 10,
        },
    },
    stage: {
        keepCentered: DEFAULT_KEEP_CENTERED,
        hideNavBar: DEFAULT_HIDE_NAVBAR,
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
}

describe("page actions in board reducer", () => {
    it("add a page at the correct index", () => {
        const newPage = new BoardPage().setID("pidNew")
        const updatedState = reducer(
            mockState1,
            action.ADD_PAGE({ page: newPage, index: 1 })
        )
        expect(updatedState.pageRank).toEqual([
            page1.pageId,
            newPage.pageId,
            page2.pageId,
            page3.pageId,
            page4.pageId,
        ])
    })

    it("concatonates the page with an index that exceeds the valid range", () => {
        const newPage1 = new BoardPage().setID("pidNew1")
        const newPage2 = new BoardPage().setID("pidNew2")

        let updatedState = reducer(
            mockState1,
            action.ADD_PAGE({ page: newPage1, index: 420 })
        )

        expect(updatedState.pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
            page4.pageId,
            newPage1.pageId,
        ])

        updatedState = reducer(
            updatedState,
            action.ADD_PAGE({ page: newPage2, index: -1337 })
        )

        expect(updatedState.pageRank).toEqual([
            page1.pageId,
            page2.pageId,
            page3.pageId,
            page4.pageId,
            newPage1.pageId,
            newPage2.pageId,
        ])
    })
})
