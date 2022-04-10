import { FormattedMessage } from "language"
import React from "react"
import { drawing } from "state/drawing"
import { Position, ToolTip } from "components"
import { useGState } from "state"
import { Paper } from "state/board/state/index.types"
import { Backgrounds, Blank, Checkered, Ruled } from "./index.styled"

const Background: React.FC = () => {
    const { paper } = useGState("PageBackgroundSetting").drawing.pageMeta
        .background

    return (
        <Backgrounds>
            <ToolTip
                position={Position.Top}
                text={<FormattedMessage id="ToolTip.PageBackground.Blank" />}
            >
                <Blank
                    type="button"
                    $active={paper === Paper.Blank}
                    onClick={() => drawing.setPageBackground(Paper.Blank)}
                />
            </ToolTip>
            <ToolTip
                position={Position.Top}
                text={
                    <FormattedMessage id="ToolTip.PageBackground.Checkered" />
                }
            >
                <Checkered
                    type="button"
                    $active={paper === Paper.Checkered}
                    onClick={() => drawing.setPageBackground(Paper.Checkered)}
                />
            </ToolTip>
            <ToolTip
                position={Position.Top}
                text={<FormattedMessage id="ToolTip.PageBackground.Ruled" />}
            >
                <Ruled
                    type="button"
                    $active={paper === Paper.Ruled}
                    onClick={() => drawing.setPageBackground(Paper.Ruled)}
                />
            </ToolTip>
        </Backgrounds>
    )
}

export default Background
