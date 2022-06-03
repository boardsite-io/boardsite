import { FormattedMessage } from "language"
import React, { memo } from "react"
import { useGState } from "state"
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
    const { type } = useGState("ShapeTools").drawing.tool

    return (
        <StyledShapeTools>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="ToolTip.Pen" />}
            >
                <IconButton
                    aria-label="Pen tool"
                    icon={<PenIcon />}
                    active={type === ToolType.Pen}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Pen })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="ToolTip.Highlighter" />}
            >
                <IconButton
                    aria-label="Highlighter tool"
                    icon={<PenIcon />} // Highlighter Icon SVG
                    active={type === ToolType.Highlighter}
                    onClick={() => {
                        handleSetTool({ type: ToolType.Highlighter })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="ToolTip.Line" />}
            >
                <IconButton
                    aria-label="Line tool"
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
                    aria-label="Rectangle tool"
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
                    aria-label="Circle tool"
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
