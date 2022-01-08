import { FormattedMessage } from "language"
import { IconButton, Popup, ToolTip, Position, ToolIcons } from "components"
import React, { useState } from "react"
import { handleSetTool } from "drawing/handlers"
import { isDrawType } from "redux/drawing/helpers"
import store from "redux/store"
import StylePicker from "../stylepicker/stylepicker"

const ActiveTool: React.FC = () => {
    const [open, setOpen] = useState(false)
    const { style, type, latestDrawType } = store.getState().drawing.tool
    const isDraw = isDrawType(type)
    const ToolIcon = latestDrawType
        ? ToolIcons[latestDrawType]
        : ToolIcons[type]

    return (
        <>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="Tool.Active" />}>
                <IconButton
                    active={isDraw}
                    onClick={() =>
                        isDraw
                            ? setOpen(true)
                            : handleSetTool({ type: latestDrawType })
                    }
                    style={isDraw ? { background: style.color } : undefined}>
                    <ToolIcon />
                </IconButton>
            </ToolTip>
            <Popup open={open} onClose={() => setOpen(false)}>
                <StylePicker />
            </Popup>
        </>
    )
}

export default ActiveTool