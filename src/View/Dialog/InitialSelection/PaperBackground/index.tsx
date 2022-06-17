import { FormattedMessage } from "language"
import React from "react"
import { useGState } from "state"
import { Paper } from "state/board/state/index.types"
import { drawing } from "state/drawing"
import { PresetButton, Presets } from "../index.styled"

enum Orientation {
    Portrait,
    Landscape,
}

export interface FormValues {
    orientation: Orientation
}

const PaperBackground: React.FC = () => {
    const { paper } = useGState("PageBackgroundSetting").drawing.pageMeta
        .background

    return (
        <Presets>
            <PresetButton
                onClick={() => drawing.setPageBackground(Paper.Blank)}
                active={paper === Paper.Blank}
            >
                <FormattedMessage id="Dialog.InitialSelection.Input.Background.Blank" />
            </PresetButton>
            <PresetButton
                onClick={() => drawing.setPageBackground(Paper.Checkered)}
                active={paper === Paper.Checkered}
            >
                <FormattedMessage id="Dialog.InitialSelection.Input.Background.Checkered" />
            </PresetButton>
            <PresetButton
                onClick={() => drawing.setPageBackground(Paper.Ruled)}
                active={paper === Paper.Ruled}
            >
                <FormattedMessage id="Dialog.InitialSelection.Input.Background.Ruled" />
            </PresetButton>
        </Presets>
    )
}

export default PaperBackground
