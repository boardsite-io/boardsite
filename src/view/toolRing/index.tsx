import { FormattedMessage } from "language"
import React, { memo } from "react"
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
import ActiveTool from "./activeTool"
import { ToolRingWrap } from "./index.styled"

const ToolRing: React.FC = memo(() => {
    const typeSelector = useCustomSelector((state) => state.drawing.tool.type)

    return (
        <ToolRingWrap>
            <ActiveTool />
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Eraser" />}
            >
                <IconButton
                    icon={<EraserIcon />}
                    active={typeSelector === ToolType.Eraser}
                    onClick={() => handleSetTool({ type: ToolType.Eraser })}
                />
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Selection" />}
            >
                <IconButton
                    icon={<SelectIcon />}
                    active={typeSelector === ToolType.Select}
                    onClick={() => handleSetTool({ type: ToolType.Select })}
                />
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Panning" />}
            >
                <IconButton
                    icon={<PanIcon />}
                    active={typeSelector === ToolType.Pan}
                    onClick={() => handleSetTool({ type: ToolType.Pan })}
                />
            </ToolTip>
        </ToolRingWrap>
    )
})

export default ToolRing
