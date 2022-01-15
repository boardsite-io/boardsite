import { cloneDeep } from "lodash"
import { loadWorkspace, saveWorkspace } from "./workspace"
import boardState from "./board/__test__/stateV1.json"
import { newState } from "./board/state"
import { RootState } from "./types"
import { loadIndexedDB } from "./localstorage"

describe("workspace", () => {
    it("is saved and loaded", async () => {
        const mockState: Partial<RootState> = {
            board: await newState().deserialize?.(cloneDeep<any>(boardState)),
        }
        const fileData = saveWorkspace(cloneDeep<any>(mockState))

        const { board } = await loadWorkspace(fileData)

        expect(board?.serialize?.()).toEqual(mockState.board?.serialize?.())
    })

    it("throws an error for missing headers", async () => {
        const mockState: Partial<RootState> = {
            board: await newState().deserialize?.(cloneDeep<any>(boardState)),
        }
        const fileData = saveWorkspace(cloneDeep<any>(mockState))

        await expect(
            loadWorkspace(fileData.slice(48))
        ).rejects.not.toBeUndefined()
    })
})

// init db
;(async () => {
    await loadIndexedDB("board")
})()
