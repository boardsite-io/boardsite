import { FormattedMessage } from "language"
import React, { memo } from "react"
import { useGState } from "state"
import {
    CircleIcon,
    HighlighterIcon,
    IconButton,
    LineIcon,
    PenIcon,
    Position,
    RectangleIcon,
    ToolTip,
} from "components"
import { action } from "state/action"
import { ToolType } from "drawing/stroke/index.types"
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
                        action.setTool({ type: ToolType.Pen })
                    }}
                />
            </ToolTip>
            <ToolTip
                position={Position.Right}
                text={<FormattedMessage id="ToolTip.Highlighter" />}
            >
                <IconButton
                    aria-label="Highlighter tool"
                    icon={<HighlighterIcon />} // Highlighter Icon SVG
                    active={type === ToolType.Highlighter}
                    onClick={() => {
                        action.setTool({ type: ToolType.Highlighter })
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
                        action.setTool({ type: ToolType.Line })
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
                        action.setTool({ type: ToolType.Rectangle })
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
                        action.setTool({ type: ToolType.Circle })
                    }}
                />
            </ToolTip>
        </StyledShapeTools>
    )
})

export default ShapeTools
