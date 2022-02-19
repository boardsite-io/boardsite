import { FormattedMessage } from "language"
import React, { memo, useCallback } from "react"
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
import { useDrawing } from "state/drawing"
import ActiveTool from "./ActiveTool"
import { ToolRingWrap } from "./index.styled"

const ToolRing: React.FC = memo(() => {
    const { type } = useDrawing("toolType").tool

    const onClickEraser = useCallback(() => {
        if (type === ToolType.Eraser) {
            return
        }
        handleSetTool({ type: ToolType.Eraser })
        handleNotification("Tool.Eraser.Notification")
    }, [type])

    const onClickSelect = useCallback(() => {
        if (type === ToolType.Select) {
            return
        }
        handleSetTool({ type: ToolType.Select })
        handleNotification("Tool.Selection.Notification")
    }, [type])

    const onClickPan = useCallback(() => {
        if (type === ToolType.Pan) {
            return
        }
        handleSetTool({ type: ToolType.Pan })
        handleNotification("Tool.Panning.Notification")
    }, [type])

    return (
        <ToolRingWrap>
            <ActiveTool />
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Eraser" />}
            >
                <IconButton
                    icon={<EraserIcon />}
                    active={type === ToolType.Eraser}
                    onClick={onClickEraser}
                />
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Selection" />}
            >
                <IconButton
                    icon={<SelectIcon />}
                    active={type === ToolType.Select}
                    onClick={onClickSelect}
                />
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Panning" />}
            >
                <IconButton
                    icon={<PanIcon />}
                    active={type === ToolType.Pan}
                    onClick={onClickPan}
                />
            </ToolTip>
        </ToolRingWrap>
    )
})

export default ToolRing
