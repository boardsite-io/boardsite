import { FormattedMessage } from "language"
import React, { memo } from "react"
import { nanoid } from "@reduxjs/toolkit"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { SET_WIDTH } from "redux/drawing/drawing"
import { STROKE_WIDTH_PRESETS } from "consts"
import { Position, ToolTip } from "components"
import { Preset, WidthPresetInnerDot, WidthPresets } from "./index.styled"

const WidthPicker: React.FC = memo(() => {
    const widthSelector = useCustomSelector(
        (state) => state.drawing.tool.style.width
    )

    return (
        <WidthPresets>
            {STROKE_WIDTH_PRESETS.map((strokeWidth) => (
                <ToolTip
                    key={nanoid()}
                    position={Position.Left}
                    text={
                        <FormattedMessage
                            id="Tool.SelectWidth"
                            values={{ width: strokeWidth }}
                        />
                    }
                >
                    <Preset
                        $active={widthSelector === strokeWidth}
                        onClick={() => store.dispatch(SET_WIDTH(strokeWidth))}
                    >
                        <WidthPresetInnerDot $strokeWidth={strokeWidth} />
                    </Preset>
                </ToolTip>
            ))}
        </WidthPresets>
    )
})

export default WidthPicker
