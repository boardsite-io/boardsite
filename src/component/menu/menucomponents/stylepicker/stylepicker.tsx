import React from "react"
import ColorPicker from "./colorpicker/colorpicker"
import ShapeTools from "./shapetools/shapetools"
import WidthPicker from "./widthpicker/widthpicker"
import { StyledStylePicker } from "./stylepicker.styled"

const StylePicker: React.FC = () => (
    <StyledStylePicker>
        <ShapeTools />
        <ColorPicker />
        <WidthPicker />
    </StyledStylePicker>
)

export default StylePicker
