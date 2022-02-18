import { FormattedMessage } from "language"
import React, { memo } from "react"
import { nanoid } from "@reduxjs/toolkit"
import { drawing, useDrawing } from "state/drawing"
import { STROKE_WIDTH_PRESETS } from "consts"
import { Position, ToolTip } from "components"
import { Preset, WidthPresetInnerDot, WidthPresets } from "./index.styled"

const WidthPicker: React.FC = memo(() => {
    const { width } = useDrawing("WidthPicker").tool.style

    return (
        <WidthPresets>
            {STROKE_WIDTH_PRESETS.map((strokeWidth) => (
                <ToolTip
                    key={nanoid()}
                    position={Position.Left}
                    text={
                        <FormattedMessage
                            id="Tool.SelectWidth.ToolTip"
                            values={{ width: strokeWidth }}
                        />
                    }
                >
                    <Preset
                        $active={width === strokeWidth}
                        onClick={() => drawing.setWidth(strokeWidth)}
                    >
                        <WidthPresetInnerDot $strokeWidth={strokeWidth} />
                    </Preset>
                </ToolTip>
            ))}
        </WidthPresets>
    )
})

export default WidthPicker
