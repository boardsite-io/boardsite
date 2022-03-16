import { FormattedMessage } from "language"
import React, { memo } from "react"
import { drawing } from "state/drawing"
import { useGState } from "state"
import { STROKE_WIDTH_PRESETS } from "consts"
import { Position, ToolTip } from "components"
import { nanoid } from "nanoid"
import { Preset, WidthPresetInnerDot, WidthPresets } from "./index.styled"

const WidthPicker: React.FC = memo(() => {
    const { width } = useGState("WidthPicker").drawing.tool.style

    return (
        <WidthPresets>
            {STROKE_WIDTH_PRESETS.map((strokeWidth) => (
                <ToolTip
                    key={nanoid()}
                    position={Position.Left}
                    text={
                        <FormattedMessage
                            id="ToolTip.ToolWidth"
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
