import React from "react"
import { nanoid } from "@reduxjs/toolkit"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import { SET_WIDTH } from "redux/slice/drawcontrol"
import { Preset, WidthPresetInnerDot, WidthPresets } from "./widthpicker.styled"
import { STROKE_WIDTH_PRESETS } from "../../../../constants"

const WidthPicker: React.FC = () => {
    const widthSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.width
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
