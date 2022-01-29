import React, { memo } from "react"
import { useCustomSelector } from "hooks"
import { SET_COLOR } from "redux/drawing"
import store from "redux/store"
import { CustomColorPicker } from "./index.styled"

const handleChange = (newColor: string | undefined) => {
    store.dispatch(SET_COLOR(newColor))
}

const ColorPicker: React.FC = memo(() => {
    const color = useCustomSelector((state) => state.drawing.tool.style.color)

    return <CustomColorPicker color={color} onChange={handleChange} />
})

export default ColorPicker
