import reducer from "./boardcontrol"
import * as action from "./boardcontrol"

const testState = {
    pageRank: ["pid1", "pid2"],
    pageCollection: {
        pid1: {
            strokes: {
                strkid1: {
                    id: "strkid1",
                    pageId: "pid1",
                },
            },
            meta: {
                background: "checkered",
            },
        },
        pid2: {
            strokes: {
                strkid2: {
                    id: "strkid2",
                    pageId: "pid2",
                },
            },
            meta: {
                background: "blank",
            },
        },
    },
}

describe("boardcontrol reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {})).toEqual({
            pageRank: [],
            pageCollection: {},
        })
    })

    it("should update the pages correctly", () => {
        expect(
            reducer(testState, action.SET_PAGERANK(["pid2", "pid3"]))
        ).toEqual({
            pageRank: ["pid2", "pid3"],
            pageCollection: {
                pid2: {
                    strokes: {
                        strkid2: {
                            id: "strkid2",
                            pageId: "pid2",
                        },
                    },
                    meta: {
                        background: "blank",
                    },
                },
                pid3: {
                    strokes: {},
                    meta: {},
                },
            },
        })
    })

    it("updates a stroke", () => {
        expect(
            reducer(
                {
                    pageRank: ["pid1"],
                    pageCollection: {
                        pid1: {
                            strokes: {
                                strkid1: {
                                    id: "strkid1",
                                    pageId: "pid1",
                                    x: 0,
                                    y: 0,
                                },
                            },
                            meta: {
                                background: "checkered",
                            },
                        },
                    },
                },
                action.UPDATE_STROKE({
                    x: 1234,
                    y: 5678,
                    id: "strkid1",
                    pageId: "pid1",
                })
            )
        ).toHaveProperty("pageCollection.pid1.strokes.strkid1", {
            x: 1234,
            y: 5678,
            id: "strkid1",
            pageId: "pid1",
        })
    })
})
