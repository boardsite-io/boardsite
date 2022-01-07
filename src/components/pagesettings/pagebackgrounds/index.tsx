import React from "react"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { SET_PAGE_BACKGROUND } from "redux/board/board"
import { backgroundStyle } from "consts"
import { Position, ToolTip } from "components"
import { ToolTipText } from "language"
import { Backgrounds, Blank, Checkered, Ruled } from "./index.styled"

const PageBackgrounds: React.FC = () => {
    const background = useCustomSelector(
        (state) => state.board.pageMeta.background.style
    )

    return (
        <Backgrounds>
            <ToolTip
                position={Position.Top}
                text={ToolTipText.Background.Blank}>
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
                text={ToolTipText.Background.Checkered}>
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
                text={ToolTipText.Background.Ruled}>
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

export default PageBackgrounds
