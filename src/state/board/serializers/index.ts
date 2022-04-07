import { newAttachment } from "drawing/attachment/utils"
import { BoardPage } from "drawing/page"
import { assign, keys, pick } from "lodash"
import { reduceRecord } from "util/lib"
import { loadIndexedDB, saveIndexedDB } from "storage/local"
import { getDefaultBoardState } from "../state/default"
import { BoardState, SerializedBoardState } from "../state/index.types"
import { StateSerializer } from "../../types"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2021-10-22 - Added versioning
*/
export const BOARD_VERSION = "1.0"

export class BoardSerializer
    implements StateSerializer<BoardState, SerializedBoardState>
{
    protected state: BoardState = getDefaultBoardState()
    private version: string = BOARD_VERSION

    serialize(): SerializedBoardState {
        // dont pollute the serialized object with image data
        const attachments = reduceRecord(this.state.attachments, (attachment) =>
            attachment.serialize()
        )

        const pageCollection = reduceRecord(this.state.pageCollection, (page) =>
            page.serialize()
        )

        return {
            version: this.version,
            currentPageIndex: this.state.currentPageIndex,
            pageRank: this.state.pageRank,
            attachments,
            pageCollection,
        }
    }

    async deserialize(serialized: SerializedBoardState): Promise<BoardState> {
        const newBoardState = getDefaultBoardState()
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
        assign(newBoardState, pick(serialized, keys(newBoardState)))

        await Promise.all(
            Object.keys(serialized.pageCollection).map(async (pageId) => {
                const page = serialized.pageCollection[pageId]
                newBoardState.pageCollection[pageId] =
                    await new BoardPage().deserialize(page)
            })
        )

        // reload attachments
        await Promise.all(
            Object.keys(serialized.attachments).map(async (attachId) => {
                const attachment = serialized.attachments[attachId]
                // make sure cachedBlob is an Uint8Array, not an object due to inflate
                attachment.cachedBlob = new Uint8Array(
                    Object.values(attachment.cachedBlob)
                )
                newBoardState.attachments[attachId] = await newAttachment(
                    attachment
                ).deserialize(attachment)
            })
        )

        return newBoardState
    }

    saveToLocalStorage(): void {
        saveIndexedDB("board", () => this.serialize())
    }

    async loadFromLocalStorage(): Promise<BoardState> {
        const serialized: SerializedBoardState = await loadIndexedDB("board")
        this.state = await this.deserialize(serialized)
        return this.state
    }
}
