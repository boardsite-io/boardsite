import React from "react"
import { useCustomSelector } from "hooks"
import { SET_COLOR } from "redux/drawing/drawing"
import store from "redux/store"
import { CustomColorPicker } from "./colorpicker.styled"

const ColorPicker: React.FC = () => {
    const color = useCustomSelector((state) => state.drawing.tool.style.color)
    const handleChange = (newColor: string | undefined) => {
        store.dispatch(SET_COLOR(newColor))
    }
    return <CustomColorPicker color={color} onChange={handleChange} />
}

export default ColorPicker
