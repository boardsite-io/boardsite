import React from "react"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { SET_PAGE_BACKGROUND } from "redux/board/board"
import { backgroundStyle } from "consts"
import { Backgrounds, Blank, Checkered, Ruled } from "./index.styled"

const PageBackgrounds: React.FC = () => {
    const background = useCustomSelector(
        (state) => state.board.pageMeta.background.style
    )

    return (
        <Backgrounds>
            <Blank
                type="button"
                $active={background === backgroundStyle.BLANK}
                onClick={() =>
                    store.dispatch(SET_PAGE_BACKGROUND(backgroundStyle.BLANK))
                }
            />
            <Checkered
                type="button"
                $active={background === backgroundStyle.CHECKERED}
                onClick={() =>
                    store.dispatch(
                        SET_PAGE_BACKGROUND(backgroundStyle.CHECKERED)
                    )
                }
            />
            <Ruled
                type="button"
                $active={background === backgroundStyle.RULED}
                onClick={() =>
                    store.dispatch(SET_PAGE_BACKGROUND(backgroundStyle.RULED))
                }
            />
        </Backgrounds>
    )
}

export default PageBackgrounds
