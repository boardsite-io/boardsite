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
import { ToolTipText } from "language"
import PenTool from "../pentool/pentool"

const ToolRing: React.FC = () => {
    const typeSelector = useCustomSelector((state) => state.drawing.tool.type)

    return (
        <>
            <PenTool />
            <ToolTip position={Position.Bottom} text={ToolTipText.EraserTool}>
                <IconButton
                    active={typeSelector === ToolType.Eraser}
                    onClick={() => handleSetTool({ type: ToolType.Eraser })}>
                    <EraserIcon />
                </IconButton>
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={ToolTipText.SelectionTool}>
                <IconButton
                    active={typeSelector === ToolType.Select}
                    onClick={() => handleSetTool({ type: ToolType.Select })}>
                    <SelectIcon />
                </IconButton>
            </ToolTip>
            <ToolTip position={Position.Bottom} text={ToolTipText.PanningTool}>
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
