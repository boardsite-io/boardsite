import { FormattedMessage } from "language"
import React, { useCallback } from "react"
import { useGState } from "state"
import { PageSize } from "state/board/state/index.types"
import { PAGE_SIZE } from "consts"
import { drawing } from "state/drawing"
import { PresetButton, Presets } from "../index.styled"

enum Orientation {
    Portrait,
    Landscape,
}

export interface FormValues {
    orientation: Orientation
}

const PaperSize: React.FC = () => {
    const { width, height } = useGState("PageSizeMenu").drawing.pageMeta.size
    const isMatch = useCallback(
        (size: PageSize) => width === size.width && height === size.height,
        [width, height]
    )
    const isPortrait = isMatch(PAGE_SIZE.A4_PORTRAIT)

    return (
        <Presets>
            <PresetButton
                onClick={() => drawing.setPageSize(PAGE_SIZE.A4_PORTRAIT)}
                active={isPortrait}
            >
                <FormattedMessage id="Dialog.InitialSelection.Input.Size.A4Portrait.Label" />
            </PresetButton>
            <PresetButton
                onClick={() => drawing.setPageSize(PAGE_SIZE.A4_LANDSCAPE)}
                active={!isPortrait}
            >
                <FormattedMessage id="Dialog.InitialSelection.Input.Size.A4Landscape.Label" />
            </PresetButton>
        </Presets>
    )
}

export default PaperSize
