import { FormattedMessage } from "language"
import React from "react"
import { useCustomSelector } from "hooks"
import {
    EraserIcon,
    IconButton,
    PanIcon,
    Position,
    SelectIcon,
    ToolTip,
} from "components"
import { handleSetTool } from "drawing/handlers"
import { ToolType } from "drawing/stroke/index.types"
import ActiveTool from "../activeTool"

const ToolRing: React.FC = () => {
    const typeSelector = useCustomSelector((state) => state.drawing.tool.type)

    return (
        <>
            <ActiveTool />
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Eraser" />}>
                <IconButton
                    active={typeSelector === ToolType.Eraser}
                    onClick={() => handleSetTool({ type: ToolType.Eraser })}>
                    <EraserIcon />
                </IconButton>
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Selection" />}>
                <IconButton
                    active={typeSelector === ToolType.Select}
                    onClick={() => handleSetTool({ type: ToolType.Select })}>
                    <SelectIcon />
                </IconButton>
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Panning" />}>
                <IconButton
                    active={typeSelector === ToolType.Pan}
                    onClick={() => handleSetTool({ type: ToolType.Pan })}>
                    <PanIcon />
                </IconButton>
            </ToolTip>
        </>
    )
}

export default ToolRing
