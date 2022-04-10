import { assign, keys, pick } from "lodash"
import { OnlineState, SerializedOnlineState } from "../state/index.types"
import { StateSerializer } from "../../types"
import { loadLocalStorage, saveLocalStorage } from "../../../storage/local"
import { getDefaultOnlineState } from "../state/default"
import { notification } from "../../notification"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2022-02-22 - Added versioning
*/
export const CURRENT_ONLINE_VERSION = "1.0"

export class OnlineSerializer
    implements StateSerializer<OnlineState, SerializedOnlineState>
{
    public state: OnlineState = getDefaultOnlineState()
    private version: string = CURRENT_ONLINE_VERSION

    serialize(): SerializedOnlineState {
        const serialized: SerializedOnlineState = {
            version: this.version,
            user: this.state.user,
        }
        if (this.state.token) {
            serialized.token = this.state.token
        }
        return serialized
    }

    // eslint-disable-next-line class-methods-use-this
    async deserialize(serialized: SerializedOnlineState): Promise<OnlineState> {
        const newOnlineState = getDefaultOnlineState()
        if (!serialized.version) {
            throw new Error("cannot deserialize state, missing version")
        }

        switch (serialized.version) {
            case CURRENT_ONLINE_VERSION:
                // latest version; no preprocessing required
                break

            default:
                throw new Error(
                    `cannot deserialize state, unknown version ${serialized.version}`
                )
        }

        // update all valid keys
        assign(newOnlineState, pick(serialized, keys(newOnlineState)))

        return newOnlineState
    }

    saveToLocalStorage(): void {
        try {
            saveLocalStorage("online", () => this.serialize())
        } catch {
            notification.create("Notification.LocalStorageSaveFailed")
        }
    }

    async loadFromLocalStorage(): Promise<OnlineState> {
        try {
            const serialized = await loadLocalStorage<SerializedOnlineState>(
                "online"
            )
            if (serialized) {
                this.state = await this.deserialize(serialized)
            }
        } catch {
            notification.create("Notification.LocalStorageLoadFailed")
        }
        return this.state
    }
}
