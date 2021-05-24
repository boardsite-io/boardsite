import React, { useState } from "react"
import { BsPencil } from "react-icons/bs"
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

    return (
        <div className="session-dialog-div">
            {typeSelector === toolType.PEN ? (
                <button
                    type="button"
                    style={{ color: colorSelector }}
                    id="icon-button-active"
                    onClick={() => setOpen(true)}>
                    <BsPencil id="icon" />
                </button>
            ) : (
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => {
                        store.dispatch(SET_TYPE(toolType.PEN))
                    }}>
                    <BsPencil id="icon" />
                </button>
            )}
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
