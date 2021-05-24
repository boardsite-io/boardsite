import React from "react"
import ColorPicker from "./colorpicker"
import WidthPicker from "./widthpicker"
import "../../../css/stylepicker.css"

const StylePicker: React.FC = () => (
    <div className="style-picker">
        <ColorPicker />
        <WidthPicker />
    </div>
)

export default StylePicker
