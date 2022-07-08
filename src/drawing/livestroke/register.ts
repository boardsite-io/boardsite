import { TEXTFIELD_MIN_HEIGHT, TEXTFIELD_MIN_WIDTH } from "consts"
import { handleAddStrokes, handleDeleteStrokes } from "drawing/handlers"
import {
    getRectanglePolygon,
    getStrokesInPoint,
    matchStrokeCollision,
} from "drawing/hitbox"
import { BoardStroke } from "drawing/stroke"
import { ToolType } from "drawing/stroke/index.types"
import { cloneDeep } from "lodash"
import { board } from "state/board"
import { drawing } from "state/drawing"
import { LiveStroke } from "./index.types"

const defaultRegister = (stroke: BoardStroke) => {
    handleAddStrokes([stroke], false)
}

const register: Record<ToolType, (stroke: BoardStroke) => void> = {
    [ToolType.Pen]: defaultRegister,
    [ToolType.Highlighter]: defaultRegister,
    [ToolType.Line]: defaultRegister,
    [ToolType.Pan]: defaultRegister,
    [ToolType.Circle]: defaultRegister,
    [ToolType.Rectangle]: defaultRegister,
    [ToolType.Eraser]: () => {
        const { erasedStrokes } = drawing.getState()
        const strokes = Object.values(erasedStrokes)

        if (strokes.length > 0) {
            handleDeleteStrokes(strokes)
        }
        drawing.clearErasedStrokes()
    },
    [ToolType.Select]: (stroke: BoardStroke) => {
        const { strokes } = board.getState().pageCollection[stroke.pageId]
        const selectedStrokes = matchStrokeCollision(
            strokes,
            getRectanglePolygon(stroke.points)
        )
        board.setTransformStrokes(Object.values(selectedStrokes), stroke.pageId)
    },
    [ToolType.Textfield]: (stroke: BoardStroke) => {
        const width = Math.abs(stroke.points[2] - stroke.points[0])
        const height = Math.abs(stroke.points[2] - stroke.points[0])

        if (width < TEXTFIELD_MIN_WIDTH && height < TEXTFIELD_MIN_HEIGHT) {
            const strokesInPoint = getStrokesInPoint({
                point: { x: stroke.points[0], y: stroke.points[1] },
                strokes: board.getState().pageCollection[stroke.pageId].strokes,
                filterType: ToolType.Textfield,
            })

            const targetStroke = strokesInPoint.pop()

            if (targetStroke) {
                board.setActiveTextfield(targetStroke)
                handleDeleteStrokes([cloneDeep(targetStroke)])
            } else {
                board.setActiveTextfield(stroke)
            }
        } else {
            board.setActiveTextfield(stroke)
        }
    },
}

export const registerStroke = (liveStroke: LiveStroke) => {
    const stroke = new BoardStroke(liveStroke)
    register[stroke.type](stroke)
}
