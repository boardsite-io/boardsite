import { FormattedMessage } from "language"
import { Popup, ToolTip, Position, ToolIcons, ToolButton } from "components"
import React, { memo, useState } from "react"
import { handleSetTool } from "drawing/handlers"
import { useCustomSelector } from "hooks"
import { isDrawType } from "redux/drawing/helpers"
import store from "redux/store"
import StylePicker from "../StylePicker"

const ActiveTool: React.FC = memo(() => {
    // Rerender on color or type change
    const toolType = useCustomSelector((state) => state.drawing.tool.type)
    const toolColor = useCustomSelector(
        (state) => state.drawing.tool.style.color
    )
    const toolWidth = useCustomSelector(
        (state) => state.drawing.tool.style.width
    )

    const [open, setOpen] = useState(false)
    const { latestDrawType } = store.getState().drawing.tool
    const isDraw = isDrawType(toolType)
    const ToolIcon = latestDrawType
        ? ToolIcons[latestDrawType]
        : ToolIcons[toolType]
    const onClick = () =>
        isDraw ? setOpen(true) : handleSetTool({ type: latestDrawType })

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
                    toolColor={toolColor}
                    toolWidth={toolWidth}
                />
            </ToolTip>
            <Popup open={open} onClose={() => setOpen(false)}>
                <StylePicker />
            </Popup>
        </>
    )
})

export default ActiveTool
