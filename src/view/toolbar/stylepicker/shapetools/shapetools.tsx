import React from "react"
import { useCustomSelector } from "hooks"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    Position,
    RectangleIcon,
    ToolTip,
} from "components"
import { ToolType } from "drawing/stroke/index.types"
import { handleSetTool } from "drawing/handlers"
import { ToolTipText } from "language"
import { StyledShapeTools } from "./shapetools.styled"

const ShapeTools: React.FC = () => {
    const typeSelector = useCustomSelector((state) => state.drawing.tool.type)
    const colorSelector = useCustomSelector(
        (state) => state.drawing.tool.style.color
    )
    return (
        <StyledShapeTools>
            <ToolTip position={Position.Right} text={ToolTipText.PenTool}>
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
            </ToolTip>
            <ToolTip position={Position.Right} text={ToolTipText.LineTool}>
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
            </ToolTip>
            <ToolTip position={Position.Right} text={ToolTipText.RectangleTool}>
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
                    <RectangleIcon />
                </IconButton>
            </ToolTip>
            <ToolTip position={Position.Right} text={ToolTipText.CircleTool}>
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
            </ToolTip>
        </StyledShapeTools>
    )
}

export default ShapeTools
