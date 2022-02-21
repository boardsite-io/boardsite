import { board } from "state/board"
import { getVerifiedPages, getVerifiedPageIds } from "."
import { mockBoardState1, MOCK_PAGE_1, MOCK_PAGE_ID_1 } from "./mocks"

board.getState = () => mockBoardState1

describe("helpers", () => {
    it("should return only verified page ids", () => {
        expect(getVerifiedPageIds([MOCK_PAGE_ID_1, "fake_id"])).toEqual([
            MOCK_PAGE_ID_1,
        ])
    })

    it("should return only verified pages", () => {
        expect(getVerifiedPages([MOCK_PAGE_ID_1, "fake_id"])).toEqual([
            MOCK_PAGE_1,
        ])
    })
})
