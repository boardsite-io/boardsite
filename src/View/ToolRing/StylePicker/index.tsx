import React, { memo } from "react"
import ColorPicker from "./ColorPicker"
import ShapeTools from "./ShapeTools"
import WidthPicker from "./WidthPicker"
import { StyledStylePicker } from "./index.styled"

const StylePicker: React.FC = memo(() => (
    <StyledStylePicker>
        <ShapeTools />
        <ColorPicker />
        <WidthPicker />
    </StyledStylePicker>
))

export default StylePicker
