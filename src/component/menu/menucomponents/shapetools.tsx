import React, { useState } from "react"
import { IoShapesOutline } from "react-icons/io5"
import { FiMinus, FiCircle, FiSquare, FiTriangle } from "react-icons/fi"

import { toolType } from "../../../constants"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import { useCustomSelector } from "../../../redux/hooks"

export default function ShapeTools() {
    const [open, setOpen] = useState(false)
    const typeSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const colorSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.color
    )

    type StyleType = {
        color: string
    } | null

    let icon
    let style: StyleType = { color: colorSelector }
    switch (typeSelector) {
        case toolType.LINE:
            icon = <FiMinus id="icon" />
            break
        case toolType.RECTANGLE:
            icon = <FiSquare id="icon" />
            break
        case toolType.TRIANGLE:
            icon = <FiTriangle id="icon" />
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
                            tabIndex={0}
                            className="cover"
                            onClick={() => setOpen(false)}
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
                                    store.dispatch(SET_TYPE(toolType.TRIANGLE))
                                    setOpen(false)
                                }}>
                                <FiTriangle id="icon" />
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
