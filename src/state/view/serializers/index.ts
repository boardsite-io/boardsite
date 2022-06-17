import { assign, keys, pick } from "lodash"
import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { StateSerializer } from "state/types"
import { notification } from "state/notification"
import { SerializedViewState, ViewState } from "../state/index.types"
import { getDefaultViewState } from "../state/default"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2021-10-22 - Added versioning
*/
export const VIEW_VERSION = "1.0"

export class ViewSerializer
    implements StateSerializer<ViewState, SerializedViewState>
{
    protected state: ViewState = getDefaultViewState()
    private version: string = VIEW_VERSION

    serialize(): SerializedViewState {
        return {
            version: this.version,
            pageIndex: this.state.pageIndex,
        }
    }

    async deserialize(serialized: SerializedViewState): Promise<ViewState> {
        const newViewState = getDefaultViewState()
        if (!serialized.version) {
            throw new Error("cannot deserialize state, missing version")
        }

        switch (serialized.version) {
            case this.version:
                // latest version; no preprocessing required
                break

            default:
                throw new Error(
                    `cannot deserialize state, unknown version ${serialized.version}`
                )
        }

        // update all valid keys
        assign(newViewState, pick(serialized, keys(newViewState)))

        return newViewState
    }

    saveToLocalStorage(): void {
        try {
            saveLocalStorage("view", () => this.serialize())
        } catch {
            notification.create("Notification.LocalStorageSaveFailed")
        }
    }

    async loadFromLocalStorage(): Promise<ViewState> {
        try {
            const serialized = await loadLocalStorage<SerializedViewState>(
                "view"
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
