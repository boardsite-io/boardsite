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
import { handleSetTool } from "drawing/handlers"
import { notification } from "state/notification"
import { useGState } from "state"
import { ToolType } from "drawing/stroke/index.types"
import ActiveTool from "./ActiveTool"
import { ToolRingWrap } from "./index.styled"

const ToolRing: React.FC = memo(() => {
    const { type } = useGState("ToolRing").drawing.tool

    const onClickEraser = useCallback(() => {
        if (type === ToolType.Eraser) {
            return
        }
        handleSetTool({ type: ToolType.Eraser })
        notification.create("Notification.Tool.Eraser")
    }, [type])

    const onClickSelect = useCallback(() => {
        if (type === ToolType.Select) {
            return
        }
        handleSetTool({ type: ToolType.Select })
        notification.create("Notification.Tool.Selection")
    }, [type])

    const onClickPan = useCallback(() => {
        if (type === ToolType.Pan) {
            return
        }
        handleSetTool({ type: ToolType.Pan })
        notification.create("Notification.Tool.Panning")
    }, [type])

    return (
        <ToolRingWrap>
            <ActiveTool />
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolTip.Eraser" />}
            >
                <IconButton
                    icon={<EraserIcon />}
                    active={type === ToolType.Eraser}
                    onClick={onClickEraser}
                />
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolTip.Selection" />}
            >
                <IconButton
                    icon={<SelectIcon />}
                    active={type === ToolType.Select}
                    onClick={onClickSelect}
                />
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolTip.Panning" />}
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
