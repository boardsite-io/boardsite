import { ToolType } from "drawing/stroke/index.types"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    Popup,
    RectangleIcon,
    ToolTip,
    Position,
} from "components"
import React, { useState } from "react"
import { handleSetTool } from "drawing/handlers"
import { ToolTipText } from "language"
import { isDrawType } from "redux/drawing/helpers"
import store from "redux/store"
import StylePicker from "../stylepicker/stylepicker"

const ToolIcons = {
    [ToolType.Pen]: PenIcon,
    [ToolType.Line]: LineIcon,
    [ToolType.Rectangle]: RectangleIcon,
    [ToolType.Circle]: CircleIcon,
    [ToolType.Eraser]: PenIcon,
    [ToolType.Pan]: PenIcon,
    [ToolType.Select]: PenIcon,
}

const ActiveTool: React.FC = () => {
    const [open, setOpen] = useState(false)
    const { style, type, latestDrawType } = store.getState().drawing.tool
    const isDraw = isDrawType(type)
    const ToolIcon = latestDrawType
        ? ToolIcons[latestDrawType]
        : ToolIcons[type]

    return (
        <>
            <ToolTip position={Position.Bottom} text={ToolTipText.ActiveTool}>
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
