import React, { useState } from "react"
import { BsPencil } from "react-icons/bs"
import { FiMinus, FiCircle, FiSquare } from "react-icons/fi"
import { toolType } from "../../../constants"
import { useCustomSelector } from "../../../redux/hooks"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"
import StylePicker from "./stylepicker"

export const PenTool: React.FC = () => {
    const [open, setOpen] = useState(false)
    const typeSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const colorSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.color
    )

    let icon
    switch (typeSelector) {
        case toolType.PEN:
            icon = <BsPencil id="icon" />
            break
        case toolType.LINE:
            icon = <FiMinus id="icon" />
            break
        case toolType.RECTANGLE:
            icon = <FiSquare id="icon" />
            break
        case toolType.CIRCLE:
            icon = <FiCircle id="icon" />
            break
        default:
            icon = <BsPencil id="icon" />
            break
    }

    const isDrawingTool = () =>
        typeSelector === toolType.PEN ||
        typeSelector === toolType.LINE ||
        typeSelector === toolType.RECTANGLE ||
        typeSelector === toolType.CIRCLE

    return (
        <div className="session-dialog-div">
            <button
                type="button"
                style={isDrawingTool() ? { color: colorSelector } : {}}
                id="icon-button"
                onClick={
                    isDrawingTool()
                        ? () => setOpen(true)
                        : () => store.dispatch(SET_TYPE(toolType.PEN))
                }>
                {icon}
            </button>
            {
                // Palette Popup
                open ? (
                    <div className="popup">
                        <div
                            role="button"
                            tabIndex={0}
                            className="cover"
                            onClick={() => setOpen(false)}
                        />
                        <StylePicker />
                    </div>
                ) : null
            }
        </div>
    )
}
