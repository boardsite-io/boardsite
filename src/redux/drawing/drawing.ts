import {
    DEFAULT_ISDRAGGABLE,
    DEFAULT_ISMOUSEDOWN,
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
    DEFAULT_TOOL,
    DEFAULT_COLOR,
    DEFAULT_WIDTH,
    MAX_LIVESTROKE_PTS,
} from "consts"
import { removeArrayItem, updateObjectInArray } from "redux/helpers"
import { appendLinePoint, newStrokeSegment } from "./util/helpers"
import { selectLineCollision } from "./util/hitbox"
import {
    LiveStroke,
    StrokeMap,
    Tool,
    ToolType,
    TrNodesType,
} from "./drawing.types"

export interface DrawingState {
    isDraggable: boolean
    isMouseDown: boolean
    directDraw: boolean
    liveStroke: LiveStroke
    liveStrokeUpdate: number
    favTools: Tool[]
    trNodes: TrNodesType
    erasedStrokes: StrokeMap
}

const initState: DrawingState = {
    isDraggable: DEFAULT_ISDRAGGABLE,
    isMouseDown: DEFAULT_ISMOUSEDOWN,
    directDraw: DEFAULT_DIRECTDRAW,
    liveStroke: {
        type: DEFAULT_TOOL,
        style: {
            color: DEFAULT_COLOR,
            width: DEFAULT_WIDTH,
            opacity: 1,
        },
        id: "",
        pageId: "",
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        points: [],
        pointsSegments: [],
    },
    liveStrokeUpdate: 0,
    favTools: DEFAULT_FAV_TOOLS,
    trNodes: [],
    erasedStrokes: {},
}

const drawingReducer = (state = initState, action: any): DrawingState => {
    switch (action.type) {
        case "START_LIVESTROKE": {
            const { point, pageId } = action.payload
            return {
                ...state,
                liveStroke: {
                    ...state.liveStroke,
                    pageId,
                    x: 0,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                    points: [],
                    pointsSegments: [[point.x, point.y]],
                },
            }
        }
        case "UPDATE_LIVESTROKE": {
            const { point, stageScale, strokes, pagePosition } = action.payload
            const liveStrokeCopy = { ...state.liveStroke }
            const { pointsSegments } = liveStrokeCopy
            const lastSegment = pointsSegments[pointsSegments.length - 1]

            switch (liveStrokeCopy.type) {
                case ToolType.Pen:
                    // for continuous strokes
                    if (lastSegment.length < MAX_LIVESTROKE_PTS) {
                        appendLinePoint(lastSegment, point)
                    } else {
                        newStrokeSegment(
                            pointsSegments,
                            lastSegment,
                            stageScale,
                            point
                        )
                    }
                    return {
                        ...state,
                        liveStroke: liveStrokeCopy,
                        liveStrokeUpdate: state.liveStrokeUpdate + 1,
                    }
                case ToolType.Eraser: {
                    if (lastSegment.length < MAX_LIVESTROKE_PTS) {
                        appendLinePoint(lastSegment, point)
                    } else {
                        newStrokeSegment(
                            pointsSegments,
                            lastSegment,
                            stageScale,
                            point
                        )
                    }

                    // the eraser livestroke calculates the collision of the line
                    // between the 2 latest points and all strokes in the page
                    const selectedStrokes = selectLineCollision(
                        strokes,
                        pagePosition,
                        pointsSegments
                    )
                    const erasedStrokes: StrokeMap = {}
                    Object.keys(selectedStrokes).forEach((id) => {
                        erasedStrokes[id] = strokes[id]
                    })

                    return {
                        ...state,
                        erasedStrokes: {
                            ...state.erasedStrokes,
                            ...erasedStrokes,
                        },
                        liveStroke: liveStrokeCopy,
                        liveStrokeUpdate: state.liveStrokeUpdate + 1,
                    }
                }
                case ToolType.Circle:
                    liveStrokeCopy.x =
                        lastSegment[0] + (point.x - lastSegment[0]) / 2
                    liveStrokeCopy.y =
                        lastSegment[1] + (point.y - lastSegment[1]) / 2
                    break
                case ToolType.Rectangle:
                case ToolType.Select:
                    // eslint-disable-next-line prefer-destructuring
                    liveStrokeCopy.x = lastSegment[0]
                    // eslint-disable-next-line prefer-destructuring
                    liveStrokeCopy.y = lastSegment[1]
                    break
                default:
                    break
            }

            // only start & end point required for non continuous
            liveStrokeCopy.pointsSegments = [
                [lastSegment[0], lastSegment[1], point.x, point.y],
            ]
            return {
                ...state,
                liveStroke: liveStrokeCopy,
                liveStrokeUpdate: state.liveStrokeUpdate + 1,
            }
        }
        case "END_LIVESTROKE": {
            return {
                ...initState,
                trNodes: state.trNodes,
                liveStroke: {
                    ...initState.liveStroke,
                    style: state.liveStroke.style,
                    type: state.liveStroke.type,
                },
            }
        }
        case "SET_TR_NODES": {
            return { ...state, trNodes: action.payload }
        }
        case "ADD_FAV_TOOL": {
            // validate tool candidate
            if (
                state.liveStroke.type !== ToolType.Eraser &&
                state.liveStroke.type !== ToolType.Select
            ) {
                return {
                    ...state,
                    favTools: [
                        ...state.favTools,
                        {
                            type: state.liveStroke.type,
                            style: { ...state.liveStroke.style },
                        },
                    ],
                }
            }
            return state
        }
        case "REPLACE_FAV_TOOL": {
            const index = action.payload

            // validate tool candidate
            if (
                state.liveStroke.type !== ToolType.Eraser &&
                state.liveStroke.type !== ToolType.Select
            ) {
                return {
                    ...state,
                    favTools: updateObjectInArray(
                        state.favTools as any[],
                        index,
                        {
                            type: state.liveStroke.type,
                            style: { ...state.liveStroke.style },
                        }
                    ) as any,
                }
            }
            return state
        }
        case "REMOVE_FAV_TOOL": {
            const index = action.payload
            return {
                ...state,
                favTools: removeArrayItem(state.favTools, index) as Tool[],
            }
        }
        case "SET_TOOL": {
            const { type, style } = action.payload
            return {
                ...state,
                isDraggable: type === ToolType.Select,
                trNodes: [],
                liveStroke: { ...state.liveStroke, style: { ...style }, type },
            }
        }
        case "SET_TYPE": {
            const type = action.payload
            return {
                ...state,
                isDraggable: type === ToolType.Select,
                trNodes: [],
                liveStroke: { ...state.liveStroke, type },
            }
        }
        case "SET_COLOR": {
            return {
                ...state,
                liveStroke: {
                    ...state.liveStroke,
                    style: { ...state.liveStroke.style, color: action.payload },
                },
            }
        }
        case "SET_WIDTH": {
            return {
                ...state,
                liveStroke: {
                    ...state.liveStroke,
                    style: { ...state.liveStroke.style, width: action.payload },
                },
            }
        }
        case "SET_ISMOUSEDOWN": {
            return { ...state, isMouseDown: action.payload }
        }
        case "TOGGLE_DIRECTDRAW": {
            return { ...state, directDraw: !state.directDraw }
        }
        case "SET_ERASED_STROKES": {
            const strokes: StrokeMap = action.payload
            const erasedStrokes: StrokeMap = {}
            Object.keys(strokes).forEach((id) => {
                erasedStrokes[id] = strokes[id]
            })
            return { ...state, erasedStrokes }
        }
        default:
            return state
    }
}

export default drawingReducer
