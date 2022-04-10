import { assign, keys, pick } from "lodash"
import { SerializedSettingsState, SettingsState } from "../state/index.types"
import { StateSerializer } from "../../types"
import { getDefaultSettingsState } from "../state/default"
import { loadLocalStorage, saveLocalStorage } from "../../../storage/local"
import { notification } from "../../notification"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2021-10-22 - Added versioning
*/
export const CURRENT_THEME_VERSION = "1.0"

export class SettingsSerializer
    implements StateSerializer<SettingsState, SerializedSettingsState>
{
    protected state: SettingsState = getDefaultSettingsState()
    private version: string = CURRENT_THEME_VERSION

    serialize(): SerializedSettingsState {
        return {
            version: this.version,
            ...this.state,
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async deserialize(
        serialized: SerializedSettingsState
    ): Promise<SettingsState> {
        const newSettingsState = getDefaultSettingsState()
        if (!serialized.version) {
            throw new Error("cannot deserialize state, missing version")
        }

        switch (serialized.version) {
            case CURRENT_THEME_VERSION:
                // latest version; no preprocessing required
                break

            default:
                throw new Error(
                    `cannot deserialize state, unknown version ${serialized.version}`
                )
        }

        // update all valid keys
        assign(newSettingsState, pick(serialized, keys(newSettingsState)))

        return newSettingsState
    }

    saveToLocalStorage(): void {
        try {
            saveLocalStorage("settings", () => this.serialize())
        } catch {
            notification.create("Notification.LocalStorageSaveFailed")
        }
    }

    async loadFromLocalStorage(): Promise<SettingsState> {
        try {
            const serialized = await loadLocalStorage<SerializedSettingsState>(
                "settings"
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
