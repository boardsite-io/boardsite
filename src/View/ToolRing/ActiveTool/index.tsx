import { FormattedMessage } from "language"
import { Popup, ToolTip, Position, ToolIcons, ToolButton } from "components"
import React, { memo, useState } from "react"
import { handleNotification, handleSetTool } from "drawing/handlers"
import { isDrawType } from "state/drawing/util"
import { useDrawing } from "state/drawing"
import StylePicker from "../StylePicker"

const ActiveTool: React.FC = memo(() => {
    const [open, setOpen] = useState(false)

    const { style, type, latestDrawType } = useDrawing("ActiveTool").tool

    const isDraw = isDrawType(type)
    const ToolIcon = ToolIcons[latestDrawType ?? type]

    const onClick = () => {
        if (isDraw) {
            setOpen(true)
        } else {
            handleSetTool({ type: latestDrawType })
            handleNotification("Tool.Active.Notification")
        }
    }

    return (
        <>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Active" />}
            >
                <ToolButton
                    icon={<ToolIcon />}
                    active={isDraw}
                    onClick={onClick}
                    toolColor={style.color}
                    toolWidth={style.width}
                />
            </ToolTip>
            <Popup open={open} onClose={() => setOpen(false)}>
                <StylePicker />
            </Popup>
        </>
    )
})

export default ActiveTool
