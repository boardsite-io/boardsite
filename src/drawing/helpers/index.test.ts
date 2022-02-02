import store from "redux/store"
import { getVerifiedPages, getVerifiedPageIds } from "."
import { mockState1, MOCK_PAGE_1, MOCK_PAGE_ID_1 } from "./mocks"

jest.mock("redux/store")
store.getState = () => mockState1

it("should return only verified page ids", () => {
    expect(getVerifiedPageIds([MOCK_PAGE_ID_1, "fake_id"])).toEqual([
        MOCK_PAGE_ID_1,
    ])
})

it("should return only verified pages", () => {
    expect(getVerifiedPages([MOCK_PAGE_ID_1, "fake_id"])).toEqual([MOCK_PAGE_1])
})
