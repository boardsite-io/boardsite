import { BoardPage } from "drawing/page"
import reducer from "./boardcontrol"
import * as action from "./boardcontrol"
import { DocumentImage, Page, Stroke } from "../../types"
import { BoardStroke } from "../../board/stroke/stroke"
import { pageType } from "../../constants"

const page1 = new BoardPage(pageType.CHECKERED).setID("pid1")
page1.strokes.strkid1 = new BoardStroke({
    id: "strkid1",
    pageId: "pid1",
} as Stroke)

describe("boardcontrol reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {} as any)).toEqual({
            pageRank: [],
            pageCollection: {},
            document: [] as DocumentImage[],
            documentSrc: "",
            pageBG: pageType.BLANK,
        })
    })

    it("updates a stroke", () => {
        expect(
            reducer(
                {
                    pageRank: ["pid1"],
                    pageCollection: {
                        pid1: page1,
                    },
                    document: [] as DocumentImage[],
                    documentSrc: "",
                    pageBG: pageType.BLANK,
                },
                action.UPDATE_STROKES([
                    {
                        x: 1234,
                        y: 5678,
                        id: "strkid1",
                        pageId: "pid1",
                    },
                ])
            )
        ).toHaveProperty("pageCollection.pid1.strokes.strkid1", {
            hitboxes: [],
            x: 1234,
            y: 5678,
            id: "strkid1",
            pageId: "pid1",
            points: undefined,
            pointsSegments: undefined,
            scaleX: 1,
            scaleY: 1,
            style: {},
            type: undefined,
        })
    })
})
