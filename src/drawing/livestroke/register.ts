import { handleAddStrokes, handleDeleteStrokes } from "drawing/handlers"
import { getSelectionPolygon, matchStrokeCollision } from "drawing/hitbox"
import { BoardStroke } from "drawing/stroke"
import { ToolType } from "drawing/stroke/index.types"
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
            getSelectionPolygon(stroke.points)
        )
        board.setTransformStrokes(Object.values(selectedStrokes), stroke.pageId)
    },
}

export const registerStroke = (liveStroke: LiveStroke) => {
    const stroke = new BoardStroke(liveStroke)
    register[stroke.type](stroke)
}
