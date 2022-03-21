import { FormattedMessage } from "language"
import React from "react"
import { drawing } from "state/drawing"
import { PAPER } from "consts"
import { Position, ToolTip } from "components"
import { useGState } from "state"
import { Backgrounds, Blank, Checkered, Ruled } from "./index.styled"

const Background: React.FC = () => {
    const { style } = useGState("PageBackgroundSetting").drawing.pageMeta
        .background

    return (
        <Backgrounds>
            <ToolTip
                position={Position.Top}
                text={<FormattedMessage id="ToolTip.PageBackground.Blank" />}
            >
                <Blank
                    type="button"
                    $active={style === PAPER.BLANK}
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
                    $active={style === PAPER.CHECKERED}
                    onClick={() => drawing.setPageBackground(PAPER.CHECKERED)}
                />
            </ToolTip>
            <ToolTip
                position={Position.Top}
                text={<FormattedMessage id="ToolTip.PageBackground.Ruled" />}
            >
                <Ruled
                    type="button"
                    $active={style === PAPER.RULED}
                    onClick={() => drawing.setPageBackground(PAPER.RULED)}
                />
            </ToolTip>
        </Backgrounds>
    )
}

export default Background
