import { RootState } from "redux/types"

export const MOCK_STROKE_ID_1 = "2vl2xtzkgldbsatk"
export const MOCK_PAGE_ID_1 = "jtWj1Y7e"
export const MOCK_ID_2 = "rtzuixxy"

export const MOCK_PAGE_1 = {
    pageId: MOCK_PAGE_ID_1,
    strokes: {
        [MOCK_STROKE_ID_1]: {
            id: [MOCK_STROKE_ID_1],
            type: 1,
            style: { color: "#000000", width: 3, opacity: 1 },
            pageId: MOCK_PAGE_ID_1,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            points: [
                196, 180, 196, 179.5, 196.94, 179.03, 197.47, 179.02,
                197.73000000000002, 178.51, 199, 178, 202, 178, 211.5, 178, 214,
                178, 214.5, 178.5, 215.69, 178.94, 217, 180, 217, 182,
            ],
        },
    },
    meta: {
        background: {
            style: "blank",
            attachId: "",
            documentPageNum: 0,
        },
        size: {
            width: 620,
            height: 877,
        },
    },
}

export const mockState1 = {
    board: {
        pageCollection: {
            [MOCK_PAGE_ID_1]: MOCK_PAGE_1,
        },
    },
} as unknown as RootState
