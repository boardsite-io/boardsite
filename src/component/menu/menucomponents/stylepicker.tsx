import React from "react"
import ColorPicker from "./colorpicker"
import WidthPicker from "./widthpicker"
import { SET_COLOR } from "../../../redux/slice/drawcontrol"
import { store } from "../../../redux/store"
import "../../../css/stylepicker.css"
import { useAppSelector } from "../../../types"

export default function StylePicker() {
    const colorSelector = useAppSelector(
        (state) => state.drawControl.liveStroke.style.color
    )
    function handleChange(e) {
        store.dispatch(SET_COLOR(e.hex))
    }
    function handleChangeComplete(e) {
        store.dispatch(SET_COLOR(e.hex))
    }
    return (
        <div className="style-picker">
            <ColorPicker
                color={colorSelector}
                onChange={handleChange}
                onChangeComplete={handleChangeComplete}
            />
            <WidthPicker />
        </div>
    )
}
