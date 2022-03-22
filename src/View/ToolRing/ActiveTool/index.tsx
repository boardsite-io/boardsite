import { FormattedMessage } from "language"
import { Popup, ToolTip, Position, ToolIcons, ToolButton } from "components"
import React, { memo, useState } from "react"
import { handleSetTool } from "drawing/handlers"
import { useGState } from "state"
import { notification } from "state/notification"
import { menu } from "state/menu"
import { isDrawType } from "util/drawing"
import StylePicker from "../StylePicker"

const ActiveTool: React.FC = memo(() => {
    const [open, setOpen] = useState(false)

    const { style, type, latestDrawType } = useGState("ActiveTool").drawing.tool

    const isDraw = isDrawType(type)
    const ToolIcon = ToolIcons[latestDrawType ?? type]

    const onClick = () => {
        if (isDraw) {
            setOpen(true)
            menu.closeMainMenu()
        } else {
            handleSetTool({ type: latestDrawType })
            notification.create("Notification.Tool.Active")
        }
    }

    return (
        <>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolTip.Active" />}
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
