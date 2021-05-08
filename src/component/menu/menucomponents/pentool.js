import React, { useState } from "react"
import { BsPencil } from "react-icons/bs"
import { useSelector } from "react-redux"
import { toolType } from "../../../constants"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"
import StylePicker from "./stylepicker"

export default function ToolRing() {
    const [open, setOpen] = useState(false)
    const typeSelector = useSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const colorSelector = useSelector(
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
                            tabIndex="0"
                            className="cover"
                            onClick={() => setOpen(false)}
                            onKeyPress={() => {}}
                        />
                        <StylePicker />
                    </div>
                ) : null
            }
        </div>
    )
}
