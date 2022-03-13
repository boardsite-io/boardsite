/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import { Theme } from "theme"
import {
    CURRENT_THEME_VERSION,
    serializeThemeState,
    deserializeThemeState,
} from "."
import stateV1 from "./__test__/stateV1.json"
import { SerializedState } from "../../index.types"
import { ThemeState } from "../state/index.types"

describe("board reducer state", () => {
    it("should serialize the default state", () => {
        const themeState: ThemeState = { theme: Theme.Light }
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
        const want = { theme: Theme.Light }

        expect(JSON.stringify(got)).toEqual(JSON.stringify(want))
    })

    it("should deserialize the state version 1.0", async () => {
        const drawingState = await deserializeThemeState(
            cloneDeep(stateV1) as Partial<SerializedState<ThemeState>>
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
