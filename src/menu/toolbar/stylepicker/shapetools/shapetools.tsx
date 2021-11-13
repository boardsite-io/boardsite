import React from "react"
import { useCustomSelector } from "redux/hooks"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    SquareIcon,
} from "components"
import { ToolType } from "drawing/stroke/types"
import { handleSetTool } from "drawing/handlers"
import { StyledShapeTools } from "./shapetools.styled"

const ShapeTools: React.FC = () => {
    const typeSelector = useCustomSelector(
        (state) => state.drawing.liveStroke.type
    )
    const colorSelector = useCustomSelector(
        (state) => state.drawing.liveStroke.style.color
    )
    return (
        <StyledShapeTools>
            <IconButton
                active={typeSelector === ToolType.Pen}
                onClick={() => {
                    handleSetTool({ type: ToolType.Pen })
                }}
                style={
                    typeSelector === ToolType.Pen
                        ? { background: colorSelector }
                        : undefined
                }>
                <PenIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Line}
                onClick={() => {
                    handleSetTool({ type: ToolType.Line })
                }}
                style={
                    typeSelector === ToolType.Line
                        ? { background: colorSelector }
                        : undefined
                }>
                <LineIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Rectangle}
                onClick={() => {
                    handleSetTool({ type: ToolType.Rectangle })
                }}
                style={
                    typeSelector === ToolType.Rectangle
                        ? { background: colorSelector }
                        : undefined
                }>
                <SquareIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Circle}
                onClick={() => {
                    handleSetTool({ type: ToolType.Circle })
                }}
                style={
                    typeSelector === ToolType.Circle
                        ? { background: colorSelector }
                        : undefined
                }>
                <CircleIcon />
            </IconButton>
        </StyledShapeTools>
    )
}

export default ShapeTools
