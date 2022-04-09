/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import { CURRENT_DRAWING_VERSION } from "."
import { getDefaultDrawingState } from "../state/default"
import stateV1 from "./__test__/stateV1.json"
import { SerializedDrawingState } from "../state/index.types"
import { Drawing } from "../state"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const got = new Drawing().serialize()
        const want = {
            version: CURRENT_DRAWING_VERSION,
            ...getDefaultDrawingState(),
        }

        expect(got).toStrictEqual(want)
    })

    it("should deserialize the state version 1.0", async () => {
        const drawingState = await new Drawing().deserialize(
            cloneDeep<unknown>(stateV1) as SerializedDrawingState
        )
        const got = new Drawing(drawingState).serialize()
        const want = stateV1

        expect(got).toStrictEqual(want)
    })

    it("throws an error for unknown or missing version", async () => {
        await expect(new Drawing().deserialize({} as any)).rejects.toThrow(
            "cannot deserialize state, missing version"
        )

        await expect(
            new Drawing().deserialize({ version: "0.1" } as any)
        ).rejects.toThrow("cannot deserialize state, unknown version 0.1")
    })
})
