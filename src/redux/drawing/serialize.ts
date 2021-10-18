import { BoardLiveStroke } from "drawing/stroke/livestroke"
import { DrawingState } from "./drawing"

export const serialize = (state: DrawingState): string => {
    const stateCopy = { ...state }
    stateCopy.liveStroke.points = []
    stateCopy.liveStroke.pointsSegments = []
    stateCopy.liveStrokeUpdate = 0
    stateCopy.trNodes = []
    stateCopy.erasedStrokes = {}
    return JSON.stringify(stateCopy)
}

export const deserialize = (state: string): DrawingState => {
    const parsedState = JSON.parse(state)
    parsedState.liveStroke = new BoardLiveStroke(parsedState.liveStroke) // deserialize a new instance
    return parsedState
}
