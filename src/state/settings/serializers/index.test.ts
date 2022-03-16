/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import {
    CURRENT_THEME_VERSION,
    serializeThemeState,
    deserializeThemeState,
} from "."
import stateV1 from "./__test__/stateV1.json"
import { SerializedState } from "../../index.types"
import { SettingsState } from "../state/index.types"
import { getDefaultSettingsState } from "../state/default"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const themeState: SettingsState = getDefaultSettingsState()
        const got = serializeThemeState(themeState)
        const want = {
            version: CURRENT_THEME_VERSION,
            ...themeState,
        }

        expect(JSON.stringify(got)).toEqual(JSON.stringify(want))
    })

    it("should deserialize an empty object and set the defaults", async () => {
        const got = await deserializeThemeState({
            version: CURRENT_THEME_VERSION,
        })
        const want = getDefaultSettingsState()

        expect(JSON.stringify(got)).toEqual(JSON.stringify(want))
    })

    it("should deserialize the state version 1.0", async () => {
        const drawingState = await deserializeThemeState(
            cloneDeep(stateV1) as Partial<SerializedState<SettingsState>>
        )
        const got = serializeThemeState(drawingState)
        const want = stateV1

        expect(JSON.stringify(got)).toBe(JSON.stringify(want))
    })

    it("throws an error for unknown or missing version", async () => {
        await expect(deserializeThemeState({})).rejects.toThrow(
            "cannot deserialize state, missing version"
        )

        await expect(
            deserializeThemeState({
                version: "0.1",
            } as any)
        ).rejects.toThrow("cannot deserialize state, unknown version 0.1")
    })
})
