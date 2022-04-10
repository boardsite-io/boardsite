/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import { VIEW_VERSION } from "."
import { View } from "../state"
import { getDefaultViewState } from "../state/default"
import { SerializedViewState } from "../state/index.types"
import stateV1 from "./__test__/stateV1.json"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const got = new View().serialize()
        const want: SerializedViewState = {
            version: VIEW_VERSION,
            pageIndex: getDefaultViewState().pageIndex,
        }
        expect(got).toStrictEqual(want)
    })

    it("should deserialize the state version 1.0", async () => {
        const boardState = await new View().deserialize(
            cloneDeep<SerializedViewState>(stateV1)
        )
        const got = new View().setState(boardState).serialize()
        const want = stateV1

        expect(got).toStrictEqual(want)
    })

    it("throws an error for unknown or missing version", async () => {
        await expect(new View().deserialize({} as any)).rejects.toThrow(
            "cannot deserialize state, missing version"
        )

        await expect(
            new View().deserialize({ version: "0.1" } as any)
        ).rejects.toThrow("cannot deserialize state, unknown version 0.1")
    })
})
