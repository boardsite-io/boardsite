import React from "react"
import { nanoid } from "@reduxjs/toolkit"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { SET_WIDTH } from "redux/drawing/drawing"
import { STROKE_WIDTH_PRESETS } from "consts"
import { Preset, WidthPresetInnerDot, WidthPresets } from "./widthpicker.styled"

const WidthPicker: React.FC = () => {
    const widthSelector = useCustomSelector(
        (state) => state.drawing.tool.style.width
    )

    return (
        <WidthPresets>
            {STROKE_WIDTH_PRESETS.map((strokeWidth) => (
                <Preset
                    key={nanoid()}
                    $active={widthSelector === strokeWidth}
                    onClick={() => store.dispatch(SET_WIDTH(strokeWidth))}>
                    <WidthPresetInnerDot $strokeWidth={strokeWidth} />
                </Preset>
            ))}
        </WidthPresets>
    )
}

export default WidthPicker
