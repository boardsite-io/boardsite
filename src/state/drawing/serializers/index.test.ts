/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import {
    CURRENT_DRAWING_VERSION,
    deserializeDrawingState,
    serializeDrawingState,
} from "."
import { getDefaultDrawingState } from "../state/default"
import { SerializedDrawingState } from "../state/index.types"
import stateV1 from "./__test__/stateV1.json"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const got = serializeDrawingState(getDefaultDrawingState())
        const want = {
            version: CURRENT_DRAWING_VERSION,
            ...getDefaultDrawingState(),
        }

        expect(JSON.stringify(got)).toEqual(JSON.stringify(want))
    })

    it("should deserialize an empty object and set the defaults", async () => {
        const got = await deserializeDrawingState({
            version: CURRENT_DRAWING_VERSION,
        })
        const want = getDefaultDrawingState()

        expect(JSON.stringify(got)).toEqual(JSON.stringify(want))
    })

    it("should deserialize the state version 1.0", async () => {
        const drawingState = await deserializeDrawingState(
            cloneDeep(stateV1) as Partial<SerializedDrawingState>
        )
        const got = serializeDrawingState(drawingState)
        const want = stateV1

        expect(JSON.stringify(got)).toBe(JSON.stringify(want))
    })

    it("throws an error for unknown or missing version", async () => {
        await expect(deserializeDrawingState({})).rejects.toThrow(
            "cannot deserialize state, missing version"
        )

        await expect(
            deserializeDrawingState({
                version: "0.1",
            } as any)
        ).rejects.toThrow("cannot deserialize state, unknown version 0.1")
    })
})
