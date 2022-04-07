import React, { memo } from "react"
import ColorPicker from "./ColorPicker"
import ShapeTools from "./ShapeTools"
import WidthPicker from "./WidthPicker"
import { StylePickerWrap } from "./index.styled"

const StylePicker: React.FC = memo(() => (
    <StylePickerWrap>
        <ShapeTools />
        <ColorPicker />
        <WidthPicker />
    </StylePickerWrap>
))

export default StylePicker
