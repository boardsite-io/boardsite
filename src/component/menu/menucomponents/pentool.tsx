import React, { useState } from "react"
import { BsPencil } from "react-icons/bs"
import { FiMinus, FiCircle, FiSquare } from "react-icons/fi"
import { toolType } from "../../../constants"
import { useCustomSelector } from "../../../redux/hooks"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"
import StylePicker from "./stylepicker"

export default function ToolRing(): JSX.Element {
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

    return (
        <div className="session-dialog-div">
            <button
                type="button"
                style={
                    typeSelector === toolType.PEN ||
                    typeSelector === toolType.LINE ||
                    typeSelector === toolType.RECTANGLE ||
                    typeSelector === toolType.CIRCLE
                        ? { color: colorSelector }
                        : {}
                }
                id="icon-button"
                onClick={
                    typeSelector === toolType.PEN ||
                    typeSelector === toolType.LINE ||
                    typeSelector === toolType.RECTANGLE ||
                    typeSelector === toolType.CIRCLE
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
