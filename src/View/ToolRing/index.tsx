import { FormattedMessage } from "language"
import React, { memo, useCallback } from "react"
import { useCustomSelector } from "hooks"
import {
    EraserIcon,
    IconButton,
    PanIcon,
    Position,
    SelectIcon,
    ToolTip,
} from "components"
import { handleNotification, handleSetTool } from "drawing/handlers"
import { ToolType } from "drawing/stroke/index.types"
import ActiveTool from "./ActiveTool"
import { ToolRingWrap } from "./index.styled"

const ToolRing: React.FC = memo(() => {
    const typeSelector = useCustomSelector((state) => state.drawing.tool.type)

    const onClickEraser = useCallback(() => {
        if (typeSelector === ToolType.Eraser) return
        handleSetTool({ type: ToolType.Eraser })
        handleNotification("Tool.Eraser.Notification")
    }, [typeSelector])

    const onClickSelect = useCallback(() => {
        if (typeSelector === ToolType.Select) return
        handleSetTool({ type: ToolType.Select })
        handleNotification("Tool.Selection.Notification")
    }, [typeSelector])

    const onClickPan = useCallback(() => {
        if (typeSelector === ToolType.Pan) return
        handleSetTool({ type: ToolType.Pan })
        handleNotification("Tool.Panning.Notification")
    }, [typeSelector])

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
                    onClick={onClickEraser}
                />
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Selection" />}
            >
                <IconButton
                    icon={<SelectIcon />}
                    active={typeSelector === ToolType.Select}
                    onClick={onClickSelect}
                />
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Panning" />}
            >
                <IconButton
                    icon={<PanIcon />}
                    active={typeSelector === ToolType.Pan}
                    onClick={onClickPan}
                />
            </ToolTip>
        </ToolRingWrap>
    )
})

export default ToolRing
