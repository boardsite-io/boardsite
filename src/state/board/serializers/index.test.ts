/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import { BOARD_VERSION } from "."
import { getDefaultBoardState } from "../state/default"
import stateV1 from "./__test__/stateV1.json"
import { SerializedBoardState } from "../state/index.types"
import { Board } from "../state"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const got = new Board().serialize()
        const want: SerializedBoardState = {
            version: BOARD_VERSION,
            ...getDefaultBoardState(),
        }
        delete want.undoStack
        delete want.redoStack
        delete want.strokeUpdates
        delete want.transformPagePosition
        delete want.transformStrokes
        delete want.activeTextfield

        expect(got).toStrictEqual(want)
    })

    it("should deserialize the state version 1.0", async () => {
        const boardState = await new Board().deserialize(
            cloneDeep<unknown>(stateV1) as SerializedBoardState
        )
        const got = new Board().setState(boardState).serialize()
        const want = stateV1

        expect(got).toStrictEqual(want)
    })

    it("throws an error for unknown or missing version", async () => {
        await expect(new Board().deserialize({} as any)).rejects.toThrow(
            "cannot deserialize state, missing version"
        )

        await expect(
            new Board().deserialize({ version: "0.1" } as any)
        ).rejects.toThrow("cannot deserialize state, unknown version 0.1")
    })
})
