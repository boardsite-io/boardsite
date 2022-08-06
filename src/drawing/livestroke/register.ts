import { TEXTFIELD_MIN_HEIGHT, TEXTFIELD_MIN_WIDTH } from "consts"
import {
    getRectanglePolygon,
    getStrokesInPoint,
    getStrokesInPolygon,
} from "drawing/hitbox"
import { BoardStroke } from "drawing/stroke"
import { ToolType } from "drawing/stroke/index.types"
import { board } from "state/board"
import { drawing } from "state/drawing"
import { action } from "state/action"
import { LiveStroke } from "./index.types"
import { ActiveTextfield } from "../../state/board/state/index.types"

const defaultRegister = (stroke: BoardStroke) => {
    action.addStrokes([stroke])
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
            action.deleteStrokes(strokes)
        }
        drawing.clearErasedStrokes()
    },
    [ToolType.Select]: (stroke: BoardStroke) => {
        const selectedStrokes = getStrokesInPolygon({
            strokes: board.getState().pageCollection[stroke.pageId].strokes,
            polygon: getRectanglePolygon(stroke.points),
        })
        board.setTransformStrokes(selectedStrokes, stroke.pageId)
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

            const targetStroke = strokesInPoint.pop() as ActiveTextfield

            if (targetStroke?.textfield) {
                targetStroke.isUpdate = true
                drawing.setTextfieldAttributes(targetStroke.textfield)
                board.setActiveTextfield(targetStroke)
                board.hideStrokes([targetStroke])
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
