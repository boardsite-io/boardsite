import { BoardStroke } from "drawing/stroke/stroke"
import { BoardState } from "./types"

export const serialize = (state: BoardState): string => {
    const stateCopy = { ...state }
    const { pageCollection } = state
    Object.keys(pageCollection).forEach((pageId) => {
        const strokes = { ...pageCollection[pageId].strokes }
        Object.keys(strokes).forEach((strokeId) => {
            strokes[strokeId] = strokes[strokeId].serialize()
        })
    })
    return JSON.stringify(stateCopy)
}

export const deserialize = (state: string): BoardState => {
    const parsedState = JSON.parse(state)
    const { pageCollection } = parsedState
    Object.keys(pageCollection).forEach((pageId) => {
        const { strokes } = pageCollection[pageId]
        Object.keys(strokes).forEach((strokeId) => {
            const stroke = strokes[strokeId]
            strokes[strokeId] = new BoardStroke(stroke) // deserialize a new instance
        })
    })
    return parsedState
}
