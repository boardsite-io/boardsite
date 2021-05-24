import React, { useState } from "react"
import { CgErase, CgController } from "react-icons/cg"
import { BsPencil } from "react-icons/bs"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import { toolType } from "../../../constants"
import StylePicker from "./stylepicker"
import ShapeTools from "./shapetools"
import { useCustomSelector } from "../../../redux/hooks"

export default function ToolRing() {
    const [open, setOpen] = useState(false)
    const typeSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const colorSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.color
    )

    return (
        <>
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
                            />
                            <StylePicker />
                        </div>
                    ) : null
                }
            </div>
            {typeSelector === toolType.ERASER ? (
                <button
                    style={{ color: colorSelector }}
                    type="button"
                    id="icon-button-active"
                    onClick={() => {
                        store.dispatch(SET_TYPE(toolType.ERASER))
                    }}>
                    <CgErase id="icon" />
                </button>
            ) : (
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => {
                        store.dispatch(SET_TYPE(toolType.ERASER))
                    }}>
                    <CgErase id="icon" />
                </button>
            )}
            <button
                style={
                    typeSelector === toolType.DRAG
                        ? { color: colorSelector }
                        : null
                }
                type="button"
                id={
                    typeSelector === toolType.DRAG
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(toolType.DRAG))
                }}>
                <CgController id="icon" />
            </button>
            <ShapeTools />
        </>
    )
}
