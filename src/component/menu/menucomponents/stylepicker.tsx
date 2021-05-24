import React from "react"
import ColorPicker from "./colorpicker"
import WidthPicker from "./widthpicker"
import "../../../css/stylepicker.css"

export default function StylePicker() {
    return (
        <div className="style-picker">
            <ColorPicker />
            <WidthPicker />
        </div>
    )
}
