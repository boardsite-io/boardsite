/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import boardState from "redux/board/__test__/stateV1.json"
import { newState } from "redux/board/state"
import { RootState } from "redux/types"
import { loadIndexedDB } from "redux/localstorage"
import { loadWorkspace, saveWorkspace } from "."

describe("workspace", () => {
    it("is saved and loaded", async () => {
        const mockState: Partial<RootState> = {
            board: await newState().deserialize?.(cloneDeep<any>(boardState)),
        }
        const fileData = saveWorkspace(cloneDeep<any>(mockState))
        const { board } = await loadWorkspace(fileData)

        expect(board?.serialize?.()).toEqual(mockState.board?.serialize?.())
    })

    it("triggers the catch block for missing headers", async () => {
        const mockState: Partial<RootState> = {
            board: await newState().deserialize?.(cloneDeep<any>(boardState)),
        }
        const fileData = saveWorkspace(cloneDeep<any>(mockState))
        const loadResult = await loadWorkspace(fileData.slice(48))

        expect(loadResult).toEqual({})
    })
})

// init db
;(async () => {
    await loadIndexedDB("board")
})()
