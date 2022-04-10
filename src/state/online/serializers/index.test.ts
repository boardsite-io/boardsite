/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from "lodash"
import { CURRENT_ONLINE_VERSION } from "./index"
import stateV1 from "./__test__/stateV1.json"
import { Online } from "../state"
import { getDefaultOnlineState } from "../state/default"
import { SerializedOnlineState } from "../state/index.types"

describe("online serialize state", () => {
    it("should serialize the default state", () => {
        const got = new Online().serialize()
        const want = {
            version: CURRENT_ONLINE_VERSION,
            ...getDefaultOnlineState(),
        }

        expect(got.user.alias).toBeTruthy()
        expect(got.user.color).toBeTruthy()

        // set due to rng naming
        got.user.alias = want.user.alias
        got.user.color = want.user.color
        expect(got.user).toStrictEqual(want.user)
        expect(got.token).toBeUndefined()
    })

    it("should deserialize the state version 1.0", async () => {
        const state = await new Online().deserialize(
            cloneDeep<unknown>(stateV1) as SerializedOnlineState
        )
        const got = new Online(state).serialize()
        const want = stateV1

        expect(got).toStrictEqual(want)
    })

    it("throws an error for unknown or missing version", async () => {
        await expect(new Online().deserialize({} as any)).rejects.toThrow(
            "cannot deserialize state, missing version"
        )

        await expect(
            new Online().deserialize({ version: "0.1" } as any)
        ).rejects.toThrow("cannot deserialize state, unknown version 0.1")
    })
})
