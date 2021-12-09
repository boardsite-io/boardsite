/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import stateV1 from "./__test__/stateV1.json"
import { drawingVersion, newState } from "./state"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const got = JSON.stringify(newState().serialize?.())
        const want = JSON.stringify({ version: drawingVersion, ...newState() })
        expect(got).toEqual(want)
    })

    it("should deserialize an emtpy object and set the defaults", () => {
        const got = newState().deserialize?.({
            version: drawingVersion,
        } as any)
        const want = newState()
        expect(JSON.stringify(got?.serialize?.())).toEqual(
            JSON.stringify(want.serialize?.())
        )
    })

    it("should deserialize the state version 1.0", () => {
        const got = newState()
            .deserialize?.(cloneDeep(stateV1) as any)
            .serialize?.()
        const want = stateV1
        expect(JSON.stringify(got)).toBe(JSON.stringify(want))
    })

    it("throws an error for unknown or missing version", () => {
        expect(() => newState().deserialize?.({} as any)).toThrowError()
        expect(() =>
            newState().deserialize?.({
                version: "0.1",
            } as any)
        ).toThrowError()
    })
})
