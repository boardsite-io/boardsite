import React from "react"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import { STROKE_WIDTH_PRESETS } from "consts"
import { nanoid } from "nanoid"
import { Preset, WidthPresetInnerDot, WidthPresets } from "./widthpicker.styled"

const WidthPicker: React.FC = () => {
    const widthSelector = useCustomSelector(
        (state) => state.drawing.liveStroke.style.width
    )

    return (
        <WidthPresets>
            {STROKE_WIDTH_PRESETS.map((strokeWidth) => (
                <Preset
                    key={nanoid()}
                    $active={widthSelector === strokeWidth}
                    onClick={() =>
                        store.dispatch({
                            type: "SET_WIDTH",
                            payload: strokeWidth,
                        })
                    }>
                    <WidthPresetInnerDot $strokeWidth={strokeWidth} />
                </Preset>
            ))}
        </WidthPresets>
    )
}

export default WidthPicker
