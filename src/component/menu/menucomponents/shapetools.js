import React, { useState } from "react"
import { IoShapesOutline } from "react-icons/io5"
import { FiMinus, FiCircle, FiSquare } from "react-icons/fi"

import { useSelector } from "react-redux"
import { toolType } from "../../../constants"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"

export default function ShapeTools() {
    const [open, setOpen] = useState(false)
    const typeSelector = useSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const colorSelector = useSelector(
        (state) => state.drawControl.liveStroke.style.color
    )

    let icon
    let style = { color: colorSelector }
    switch (typeSelector) {
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
            icon = <IoShapesOutline id="icon" />
            style = null
            break
    }

    return (
        <div>
            <button
                style={style}
                type="button"
                id="icon-button"
                onClick={() => setOpen(true)}>
                {icon}
            </button>
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
                        <div className="shapetools">
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.LINE))
                                    setOpen(false)
                                }}>
                                <FiMinus id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.RECTANGLE))
                                    setOpen(false)
                                }}>
                                <FiSquare id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.CIRCLE))
                                    setOpen(false)
                                }}>
                                <FiCircle id="icon" />
                            </button>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}
