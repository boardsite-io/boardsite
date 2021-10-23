import stateV1 from "./__test__/stateV1.json"
import { boardVersion, newState } from "./state"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const got = newState().serialize?.()
        const want = JSON.stringify({ version: boardVersion, ...newState() })
        expect(got).toEqual(want)
    })

    it("should deserialize an emtpy object and set the defaults", () => {
        const got = newState().deserialize?.(`{"version": "1.0"}`)
        const want = newState()
        expect(got?.serialize?.()).toEqual(want.serialize?.())
    })

    it("should deserialize the state version 1.0", () => {
        const got = newState()
            .deserialize?.(JSON.stringify(stateV1))
            .serialize?.()
        const want = JSON.stringify(stateV1)
        expect(got).toEqual(want)
    })

    it("throws an error for unkown or missing version", () => {
        expect(() => newState().deserialize?.(`{}`)).toThrowError()
        expect(() =>
            newState().deserialize?.(`{"version": "0.1"}}`)
        ).toThrowError()
    })
})
