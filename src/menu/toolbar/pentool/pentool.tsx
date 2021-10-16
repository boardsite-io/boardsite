import { ToolType } from "redux/drawing/drawing.types"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    Popup,
    SquareIcon,
    IconProps,
} from "components"
import React, { useState } from "react"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import StylePicker from "../stylepicker/stylepicker"

const PenTool: React.FC = () => {
    const [open, setOpen] = useState(false)
    const typeSelector = useCustomSelector(
        (state) => state.drawing.liveStroke.type
    )
    const colorSelector = useCustomSelector(
        (state) => state.drawing.liveStroke.style.color
    )
    const isDrawingTool = () =>
        typeSelector === ToolType.Pen ||
        typeSelector === ToolType.Line ||
        typeSelector === ToolType.Rectangle ||
        typeSelector === ToolType.Circle

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
            {isDrawingTool() ? (
                <IconButton
                    active
                    onClick={() => setOpen(true)}
                    style={{ background: colorSelector }}>
                    <IconX />
                </IconButton>
            ) : (
                <IconButton
                    onClick={() =>
                        store.dispatch({
                            type: "SET_TYPE",
                            payload: ToolType.Pen,
                        })
                    }>
                    <IconX />
                </IconButton>
            )}
            <Popup open={open} onClose={() => setOpen(false)}>
                <StylePicker />
            </Popup>
        </>
    )
}

export default PenTool
