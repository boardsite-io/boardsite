import React from "react"
import ColorPicker from "./colorpicker"
import WidthPicker from "./widthpicker"
import { SET_COLOR } from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"
import "../../../css/stylepicker.css"
import { useCustomSelector } from "../../../redux/hooks"

export default function StylePicker() {
    const colorSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.color
    )
    function handleChange(e: any) {
        store.dispatch(SET_COLOR(e.hex))
    }

    return (
        <div className="style-picker">
            <ColorPicker color={colorSelector} onChange={handleChange} />
            <WidthPicker />
        </div>
    )
}
