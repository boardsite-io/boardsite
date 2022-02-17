import React, { memo } from "react"
import { drawing, useDrawing } from "state/drawing"
import { CustomColorPicker } from "./index.styled"

const handleChange = (newColor: string) => {
    drawing.setColor(newColor)
}

const ColorPicker: React.FC = memo(() => {
    const { color } = useDrawing("toolStyle").tool.style

    return <CustomColorPicker color={color} onChange={handleChange} />
})

export default ColorPicker
