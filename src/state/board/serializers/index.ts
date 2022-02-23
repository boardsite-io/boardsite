import { newAttachment } from "drawing/attachment/utils"
import { BoardPage } from "drawing/page"
import { BoardStroke } from "drawing/stroke"
import { assign, cloneDeep, keys, pick } from "lodash"
import { getDefaultBoardState } from "../state/default"
import { BoardState } from "../state/index.types"
import { SerializedState } from "../../index.types"

/*
    Version of the board state reducer to allow backward compatibility for stored data
    [1.0] - 2021-10-22 - Added versioning
*/
export const BOARD_VERSION = "1.0"

export const serializeBoardState = (
    state: BoardState
): SerializedState<BoardState> => {
    const stateClone = cloneDeep<BoardState>(state)

    // dont pollute the serialized object with image data
    Object.values(stateClone.attachments).forEach((attachment) =>
        attachment.serialize()
    )

    Object.keys(stateClone.pageCollection).forEach((pageId) => {
        const { strokes } = stateClone.pageCollection[pageId]
        Object.keys(strokes).forEach((strokeId) => {
            strokes[strokeId] = strokes[strokeId].serialize()
        })
    })

    // dont save undo redo actions and transform layer
    delete stateClone.undoStack
    delete stateClone.redoStack

    delete stateClone.strokeUpdates
    delete stateClone.transformStrokes
    delete stateClone.transformPagePosition

    return { version: BOARD_VERSION, ...stateClone }
}

export const deserializeBoardState = async (
    serializedState: SerializedState<BoardState>
): Promise<BoardState> => {
    const newBoardState = getDefaultBoardState()
    if (!serializedState.version) {
        throw new Error("cannot deserialize state, missing version")
    }

    switch (serializedState.version) {
        case BOARD_VERSION:
            // latest version; no preprocessing required
            break

        default:
            throw new Error(
                `cannot deserialize state, unknown version ${serializedState.version}`
            )
    }

    // update all valid keys
    assign(newBoardState, pick(serializedState, keys(newBoardState)))

    const { pageCollection } = newBoardState
    Object.keys(pageCollection).forEach((pageId) => {
        const page = pageCollection[pageId]
        pageCollection[pageId] = new BoardPage(page)
        const { strokes } = pageCollection[pageId]
        Object.keys(strokes).forEach((strokeId) => {
            const stroke = strokes[strokeId]
            strokes[strokeId] = new BoardStroke(stroke) // deserialize a new instance
        })
    })

    // reload attachments
    await Promise.all(
        Object.keys(newBoardState.attachments).map(async (attachId) => {
            const attachment = newBoardState.attachments[attachId]
            // make sure cachedBlob is an Uint8Array, not an object due to inflate
            attachment.cachedBlob = new Uint8Array(
                Object.values(attachment.cachedBlob)
            )
            newBoardState.attachments[attachId] = await newAttachment(
                attachment
            ).render()
        })
    )

    return newBoardState
}
