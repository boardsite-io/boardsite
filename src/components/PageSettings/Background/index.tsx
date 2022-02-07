import { FormattedMessage } from "language"
import React from "react"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { SET_PAGE_BACKGROUND } from "redux/drawing"
import { backgroundStyle } from "consts"
import { Position, ToolTip } from "components"
import { Backgrounds, Blank, Checkered, Ruled } from "./index.styled"

const Background: React.FC = () => {
    const background = useCustomSelector(
        (state) => state.drawing.pageMeta.background.style
    )

    return (
        <Backgrounds>
            <ToolTip
                position={Position.Top}
                text={<FormattedMessage id="PageBackground.Blank" />}
            >
                <Blank
                    type="button"
                    $active={background === backgroundStyle.BLANK}
                    onClick={() =>
                        store.dispatch(
                            SET_PAGE_BACKGROUND(backgroundStyle.BLANK)
                        )
                    }
                />
            </ToolTip>
            <ToolTip
                position={Position.Top}
                text={<FormattedMessage id="PageBackground.Checkered" />}
            >
                <Checkered
                    type="button"
                    $active={background === backgroundStyle.CHECKERED}
                    onClick={() =>
                        store.dispatch(
                            SET_PAGE_BACKGROUND(backgroundStyle.CHECKERED)
                        )
                    }
                />
            </ToolTip>
            <ToolTip
                position={Position.Top}
                text={<FormattedMessage id="PageBackground.Ruled" />}
            >
                <Ruled
                    type="button"
                    $active={background === backgroundStyle.RULED}
                    onClick={() =>
                        store.dispatch(
                            SET_PAGE_BACKGROUND(backgroundStyle.RULED)
                        )
                    }
                />
            </ToolTip>
        </Backgrounds>
    )
}

export default Background
