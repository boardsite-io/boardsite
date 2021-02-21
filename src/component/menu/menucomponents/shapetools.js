import React, { useState } from "react"
import {
    BsSlash,
    BsCircle,
    BsTriangle,
    BsTools,
    BsSquare,
} from "react-icons/bs"
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
            icon = <BsSlash id="icon" />
            break
        case toolType.RECTANGLE:
            icon = <BsSquare id="icon" />
            break
        case toolType.TRIANGLE:
            icon = <BsTriangle id="icon" />
            break
        case toolType.CIRCLE:
            icon = <BsCircle id="icon" />
            break
        default:
            icon = <BsTools id="icon" />
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
                                <BsSlash id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.RECTANGLE))
                                    setOpen(false)
                                }}>
                                <BsSquare id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.TRIANGLE))
                                    setOpen(false)
                                }}>
                                <BsTriangle id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.CIRCLE))
                                    setOpen(false)
                                }}>
                                <BsCircle id="icon" />
                            </button>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}
