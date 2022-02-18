/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import { BOARD_VERSION, deserializeBoardState, serializeBoardState } from "."
import { getDefaultBoardState } from "../state/default"
import { SerializedBoardState } from "../state/index.types"
import stateV1 from "./__test__/stateV1.json"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const got = serializeBoardState(getDefaultBoardState())
        const want = {
            version: BOARD_VERSION,
            ...getDefaultBoardState(),
        }

        expect(JSON.stringify(got)).toEqual(JSON.stringify(want))
    })

    it("should deserialize an empty object and set the defaults", async () => {
        const got = await deserializeBoardState({
            version: BOARD_VERSION,
        })
        const want = getDefaultBoardState()

        expect(JSON.stringify(got)).toEqual(JSON.stringify(want))
    })

    it("should deserialize the state version 1.0", async () => {
        const boardState = await deserializeBoardState(
            cloneDeep(stateV1) as unknown as Partial<SerializedBoardState> // TODO
        )
        const got = serializeBoardState(boardState)
        const want = stateV1

        expect(JSON.stringify(got)).toBe(JSON.stringify(want))
    })

    it("throws an error for unknown or missing version", async () => {
        await expect(deserializeBoardState({})).rejects.toThrow(
            "cannot deserialize state, missing version"
        )

        await expect(
            deserializeBoardState({
                version: "0.1",
            } as any)
        ).rejects.toThrow("cannot deserialize state, unknown version 0.1")
    })
})
