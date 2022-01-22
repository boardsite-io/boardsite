import React, { memo } from "react"
import ColorPicker from "./colorpicker"
import ShapeTools from "./shapetools"
import WidthPicker from "./widthpicker"
import { StyledStylePicker } from "./index.styled"

const StylePicker: React.FC = memo(() => (
    <StyledStylePicker>
        <ShapeTools />
        <ColorPicker />
        <WidthPicker />
    </StyledStylePicker>
))

export default StylePicker
