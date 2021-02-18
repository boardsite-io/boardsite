import React from "react"
import { useSelector } from "react-redux"
import ColorPicker from "./menucomponents/colorpicker"
import WidthPicker from "./menucomponents/widthpicker"
import { SET_COLOR } from "../../redux/slice/drawcontrol"
import store from "../../redux/store"
import "../../css/stylepicker.css"

export default function StylePicker() {
    const colorSelector = useSelector(
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