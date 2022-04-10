/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import { CURRENT_THEME_VERSION } from "."
import stateV1 from "./__test__/stateV1.json"
import { SerializedSettingsState } from "../state/index.types"
import { getDefaultSettingsState } from "../state/default"
import { SettingsClass } from "../state"

describe("settings serialize state", () => {
    it("should serialize the default state", () => {
        const got = new SettingsClass().serialize()
        const want = {
            version: CURRENT_THEME_VERSION,
            ...getDefaultSettingsState(),
        }

        expect(got).toStrictEqual(want)
    })

    it("should deserialize the state version 1.0", async () => {
        const state = await new SettingsClass().deserialize(
            cloneDeep<unknown>(stateV1) as SerializedSettingsState
        )
        const got = new SettingsClass(state).serialize()
        const want = stateV1

        expect(got).toStrictEqual(want)
    })

    it("throws an error for unknown or missing version", async () => {
        await expect(
            new SettingsClass().deserialize({} as any)
        ).rejects.toThrow("cannot deserialize state, missing version")

        await expect(
            new SettingsClass().deserialize({ version: "0.1" } as any)
        ).rejects.toThrow("cannot deserialize state, unknown version 0.1")
    })
})
