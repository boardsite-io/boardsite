import React from "react"
import ColorPicker from "./colorpicker"
import WidthPicker from "./widthpicker"
import "../../../css/stylepicker.css"
import ShapeTools from "./shapetools"

const StylePicker: React.FC = () => (
    <div className="style-picker">
        <ShapeTools />
        <ColorPicker />
        <WidthPicker />
    </div>
)

export default StylePicker
