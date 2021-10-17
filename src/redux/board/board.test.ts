import { Stroke, ToolType } from "redux/drawing/drawing.types"
import {
    DEFAULT_HIDE_NAVBAR,
    DEFAULT_KEEP_CENTERED,
    DEFAULT_STAGE_SCALE,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    pageType,
    STROKE_WIDTH_PRESETS,
} from "consts"
import boardReducer, { initState } from "./board"
import { createPage } from "./util/page"
import { DocumentImage } from "./board.types"

const page1 = createPage({ style: pageType.CHECKERED, id: "pid1" })
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
} as Stroke

page1.strokes.strkid1 = mockStroke1

describe("boardcontrol reducer", () => {
    it("should return the initial state", () => {
        expect(boardReducer(undefined, {})).toEqual(initState)
    })

    it("updates a stroke", () => {
        expect(
            boardReducer(
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
                    view: {
                        keepCentered: DEFAULT_KEEP_CENTERED,
                        hideNavBar: DEFAULT_HIDE_NAVBAR,
                        stageWidth: window.innerWidth,
                        stageHeight: window.innerHeight,
                        stageX: DEFAULT_STAGE_X,
                        stageY: DEFAULT_STAGE_Y,
                        stageScale: DEFAULT_STAGE_SCALE,
                    },
                },
                {
                    type: "UPDATE_STROKES",
                    payload: [
                        {
                            pageId: "pid1",
                            id: "strkid1",
                            x: 1234,
                            y: 5678,
                            scaleX: 3.32,
                            scaleY: 5.34,
                        },
                    ] as Stroke[],
                }
            )
        ).toHaveProperty("pageCollection.pid1.strokes.strkid1", {
            ...mockStroke1,
            x: 1234,
            y: 5678,
            scaleX: 3.32,
            scaleY: 5.34,
        } as Stroke)
    })

    // it("updates a stroke with missing x,y and scale", () => {
    //     expect(
    //         boardReducer(
    //             {
    //                 currentPageIndex: 0,
    //                 pageRank: ["pid1"],
    //                 pageCollection: {
    //                     pid1: page1,
    //                 },
    //                 document: [] as DocumentImage[],
    //                 documentSrc: "",
    //                 pageSettings: {
    //                     background: pageType.BLANK,
    //                     width: 10,
    //                     height: 10,
    //                 },
    //                 view: {
    //                     keepCentered: DEFAULT_KEEP_CENTERED,
    //                     hideNavBar: DEFAULT_HIDE_NAVBAR,
    //                     stageWidth: window.innerWidth,
    //                     stageHeight: window.innerHeight,
    //                     stageX: DEFAULT_STAGE_X,
    //                     stageY: DEFAULT_STAGE_Y,
    //                     stageScale: DEFAULT_STAGE_SCALE,
    //                 },
    //             },
    //             {
    //                 type: "UPDATE_STROKES",
    //                 payload: [
    //                     {
    //                         pageId: "pid1",
    //                         id: "strkid1",
    //                         x: 1234,
    //                         y: 5678,
    //                         scaleX: 1,
    //                         scaleY: 1,
    //                     },
    //                 ],
    //             }
    //         )
    //     ).toHaveProperty("pageCollection.pid1.strokes.strkid1", {
    //         ...mockStroke1,
    //         x: 0,
    //         y: 0,
    //         scaleX: 1,
    //         scaleY: 1,
    //     })
    // })
})
