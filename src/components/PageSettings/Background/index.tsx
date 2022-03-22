import { FormattedMessage } from "language"
import React from "react"
import { drawing } from "state/drawing"
import { PAPER } from "consts"
import { Position, ToolTip } from "components"
import { useGState } from "state"
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
                    $active={paper === PAPER.BLANK}
                    onClick={() => drawing.setPageBackground(PAPER.BLANK)}
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
                    $active={paper === PAPER.CHECKERED}
                    onClick={() => drawing.setPageBackground(PAPER.CHECKERED)}
                />
            </ToolTip>
            <ToolTip
                position={Position.Top}
                text={<FormattedMessage id="ToolTip.PageBackground.Ruled" />}
            >
                <Ruled
                    type="button"
                    $active={paper === PAPER.RULED}
                    onClick={() => drawing.setPageBackground(PAPER.RULED)}
                />
            </ToolTip>
        </Backgrounds>
    )
}

export default Background
