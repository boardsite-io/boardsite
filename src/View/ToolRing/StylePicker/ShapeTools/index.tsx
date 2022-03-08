import { FormattedMessage } from "language"
import React, { memo } from "react"
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
import { useDrawing } from "state/drawing"
import { StyledShapeTools } from "./index.styled"

const ShapeTools: React.FC = memo(() => {
    const { type } = useDrawing("ShapeTools").tool

    return (
        <StyledShapeTools>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="ToolTip.Pen" />}
            >
                <IconButton
                    icon={<PenIcon />}
                    active={type === ToolType.Pen}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Pen })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="ToolTip.Line" />}
            >
                <IconButton
                    icon={<LineIcon />}
                    active={type === ToolType.Line}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Line })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="ToolTip.Rectangle" />}
            >
                <IconButton
                    icon={<RectangleIcon />}
                    active={type === ToolType.Rectangle}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Rectangle })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="ToolTip.Circle" />}
            >
                <IconButton
                    icon={<CircleIcon />}
                    active={type === ToolType.Circle}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Circle })
                    }}
                />
            </ToolTip>
        </StyledShapeTools>
    )
})

export default ShapeTools
