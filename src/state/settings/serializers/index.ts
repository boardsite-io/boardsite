import { assign, keys, pick } from "lodash"
import { SerializedSettingsState, SettingsState } from "../state/index.types"
import { StateSerializer } from "../../types"
import { getDefaultSettingsState } from "../state/default"
import { loadLocalStorage, saveLocalStorage } from "../../../storage/local"

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
        saveLocalStorage("settings", () => this.serialize())
    }

    async loadFromLocalStorage(): Promise<SettingsState> {
        const serialized: SerializedSettingsState = await loadLocalStorage(
            "settings"
        )
        this.state = await this.deserialize(serialized)
        return this.state
    }
}
