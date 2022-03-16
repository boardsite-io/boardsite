import React, { memo } from "react"
import { drawing } from "state/drawing"
import { useGState } from "state"
import { CustomColorPicker } from "./index.styled"

const handleChange = (newColor: string) => {
    drawing.setColor(newColor)
}

const ColorPicker: React.FC = memo(() => {
    const { color } = useGState("ColorPicker").drawing.tool.style

    return <CustomColorPicker color={color} onChange={handleChange} />
})

export default ColorPicker
