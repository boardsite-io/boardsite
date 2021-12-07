import { BoardPage } from "drawing/page"
import { BoardStroke } from "drawing/stroke/stroke"
import { Stroke, ToolType } from "drawing/stroke/types"
import {
    DEFAULT_HIDE_NAVBAR,
    DEFAULT_KEEP_CENTERED,
    DEFAULT_STAGE_SCALE,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    backgroundStyle,
    STROKE_WIDTH_PRESETS,
} from "consts"
import reducer from "./board"
import * as action from "./board"
import { PageMeta } from "./board.types"

const page1 = new BoardPage().setID("pid1").updateMeta({
    background: { style: backgroundStyle.CHECKERED },
} as PageMeta)
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

describe("boardcontrol reducer", () => {
    // it("should return the initial state", () => {
    //     expect(reducer(undefined, {} as AnyAction)).toEqual(newState())
    // })

    it("updates a stroke", () => {
        expect(
            reducer(
                {
                    currentPageIndex: 0,
                    pageRank: ["pid1"],
                    pageCollection: {
                        pid1: page1,
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
                },
                action.UPDATE_STROKES({
                    strokes: [
                        {
                            pageId: "pid1",
                            id: "strkid1",
                            x: 1234,
                            y: 5678,
                            scaleX: 3.32,
                            scaleY: 5.34,
                        },
                    ],
                })
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
                },
                action.UPDATE_STROKES({
                    strokes: [
                        {
                            pageId: "pid1",
                            id: "strkid1",
                        },
                    ],
                })
            )
        ).toHaveProperty("pageCollection.pid1.strokes.strkid1", {
            ...mockBoardStroke1,
        })
    })
})
