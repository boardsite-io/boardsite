import { assign, keys, pick } from "lodash"
import { getDefaultDrawingState } from "../state/default"
import { DrawingState, SerializedDrawingState } from "../state/index.types"
import { StateSerializer } from "../../types"
import { loadLocalStorage, saveLocalStorage } from "../../../storage/local"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2021-10-22 - Added versioning
*/
export const CURRENT_DRAWING_VERSION = "1.0"

export class DrawingSerializer
    implements StateSerializer<DrawingState, SerializedDrawingState>
{
    protected state: DrawingState = getDefaultDrawingState()
    private version: string = CURRENT_DRAWING_VERSION

    serialize(): SerializedDrawingState {
        return {
            version: this.version,
            favoriteTools: this.state.favoriteTools,
            tool: this.state.tool,
            pageMeta: this.state.pageMeta,
            erasedStrokes: {},
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async deserialize(
        serialized: SerializedDrawingState
    ): Promise<DrawingState> {
        const newDrawingState = getDefaultDrawingState()
        if (!serialized.version) {
            throw new Error("cannot deserialize state, missing version")
        }

        switch (serialized.version) {
            case CURRENT_DRAWING_VERSION:
                // latest version; no preprocessing required
                break

            default:
                throw new Error(
                    `cannot deserialize state, unknown version ${serialized.version}`
                )
        }

        // update all valid keys
        assign(newDrawingState, pick(serialized, keys(newDrawingState)))

        return newDrawingState
    }

    saveToLocalStorage(): void {
        saveLocalStorage("drawing", () => this.serialize())
    }

    async loadFromLocalStorage(): Promise<DrawingState> {
        const serialized: SerializedDrawingState = await loadLocalStorage(
            "drawing"
        )
        this.state = await this.deserialize(serialized)
        return this.state
    }
}
