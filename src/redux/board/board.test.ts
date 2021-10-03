import { BoardPage } from "drawing/page"
import { BoardStroke } from "drawing/stroke/stroke"
import { ToolType } from "drawing/stroke/types"
import { DocumentImage } from "types"
import reducer from "./board"
import * as action from "./board"
import { pageType, STROKE_WIDTH_PRESETS } from "../../constants"

const page1 = new BoardPage(pageType.CHECKERED).setID("pid1")
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
} as any
const mockBoardStroke1 = new BoardStroke(mockStroke1)

page1.strokes.strkid1 = mockBoardStroke1

describe("boardcontrol reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {} as any)).toEqual(action.initState)
    })

    it("updates a stroke", () => {
        expect(
            reducer(
                {
                    currentPageIndex: 0,
                    pageRank: ["pid1"],
                    pageCollection: {
                        pid1: page1,
                    },
                    document: [] as DocumentImage[],
                    documentSrc: "",
                    pageSettings: {
                        background: pageType.BLANK,
                        width: 10,
                        height: 10,
                    },
                },
                action.UPDATE_STROKES([
                    {
                        pageId: "pid1",
                        id: "strkid1",
                        x: 1234,
                        y: 5678,
                        scaleX: 3.32,
                        scaleY: 5.34,
                    },
                ])
            )
        ).toHaveProperty("pageCollection.pid1.strokes.strkid1", {
            ...mockBoardStroke1,
            x: 1234,
            y: 5678,
            scaleX: 3.32,
            scaleY: 5.34,
        })
    })

    it("updates a stroke with missing x,y and scale", () => {
        expect(
            reducer(
                {
                    currentPageIndex: 0,
                    pageRank: ["pid1"],
                    pageCollection: {
                        pid1: page1,
                    },
                    document: [] as DocumentImage[],
                    documentSrc: "",
                    pageSettings: {
                        background: pageType.BLANK,
                        width: 10,
                        height: 10,
                    },
                },
                action.UPDATE_STROKES([
                    {
                        pageId: "pid1",
                        id: "strkid1",
                    },
                ])
            )
        ).toHaveProperty("pageCollection.pid1.strokes.strkid1", {
            ...mockBoardStroke1,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
        })
    })
})
