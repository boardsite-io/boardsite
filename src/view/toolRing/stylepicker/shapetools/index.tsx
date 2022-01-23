import { FormattedMessage } from "language"
import React, { memo } from "react"
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
import { StyledShapeTools } from "./index.styled"

const ShapeTools: React.FC = memo(() => {
    const typeSelector = useCustomSelector((state) => state.drawing.tool.type)
    return (
        <StyledShapeTools>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="Tool.Pen" />}
            >
                <IconButton
                    icon={<PenIcon />}
                    active={typeSelector === ToolType.Pen}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Pen })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="Tool.Line" />}
            >
                <IconButton
                    icon={<LineIcon />}
                    active={typeSelector === ToolType.Line}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Line })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="Tool.Rectangle" />}
            >
                <IconButton
                    icon={<RectangleIcon />}
                    active={typeSelector === ToolType.Rectangle}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Rectangle })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="Tool.Circle" />}
            >
                <IconButton
                    icon={<CircleIcon />}
                    active={typeSelector === ToolType.Circle}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Circle })
                    }}
                />
            </ToolTip>
        </StyledShapeTools>
    )
})

export default ShapeTools
