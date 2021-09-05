import React from "react"
import { HexColorPicker } from "react-colorful"
import { useCustomSelector } from "redux/hooks"
import { SET_COLOR } from "redux/slice/drawcontrol"
import store from "redux/store"
import "./colorpicker.css"

const ColorPicker: React.FC = () => {
    const color = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.color
    )

    const handleChange = (newColor: string | undefined) => {
        store.dispatch(SET_COLOR(newColor))
    }

    return (
        <div className="color-picker">
            <HexColorPicker color={color} onChange={handleChange} />
        </div>
    )
}

export default ColorPicker
