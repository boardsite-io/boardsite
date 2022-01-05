import { ToolType } from "drawing/stroke/index.types"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    Popup,
    SquareIcon,
    IconProps,
    ToolTip,
    Position,
} from "components"
import React, { useState } from "react"
import { useCustomSelector } from "hooks"
import { handleSetTool } from "drawing/handlers"
import { ToolTipText } from "language"
import StylePicker from "../stylepicker/stylepicker"

const PenTool: React.FC = () => {
    const [open, setOpen] = useState(false)
    const typeSelector = useCustomSelector((state) => state.drawing.tool.type)
    const colorSelector = useCustomSelector(
        (state) => state.drawing.tool.style.color
    )
    const isDrawingTool = () =>
        typeSelector === ToolType.Pen ||
        typeSelector === ToolType.Line ||
        typeSelector === ToolType.Rectangle ||
        typeSelector === ToolType.Circle

    // eslint-disable-next-line react/no-unstable-nested-components
    const IconX: React.FC<IconProps> = (props) => {
        switch (typeSelector) {
            case ToolType.Pen:
                return <PenIcon {...props} />
            case ToolType.Line:
                return <LineIcon {...props} />
            case ToolType.Rectangle:
                return <SquareIcon {...props} />
            case ToolType.Circle:
                return <CircleIcon {...props} />
            default:
                return <PenIcon {...props} />
        }
    }

    return (
        <>
            <ToolTip position={Position.Bottom} text={ToolTipText.DrawingTool}>
                {isDrawingTool() ? (
                    <IconButton
                        active
                        onClick={() => setOpen(true)}
                        style={{ background: colorSelector }}>
                        <IconX />
                    </IconButton>
                ) : (
                    <IconButton
                        onClick={() => handleSetTool({ type: ToolType.Pen })}>
                        <IconX />
                    </IconButton>
                )}
            </ToolTip>
            <Popup open={open} onClose={() => setOpen(false)}>
                <StylePicker />
            </Popup>
        </>
    )
}

export default PenTool
