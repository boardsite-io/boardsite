import React from "react"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import { SET_PAGE_BACKGROUND } from "redux/board/board"
import { backgroundStyle } from "consts"
import { Backgrounds, Blank, Checkered, Ruled } from "./background.styled"

interface PageBackgroundProps {
    setOpenOther: React.Dispatch<React.SetStateAction<boolean>>
}

const PageBackgrounds: React.FC<PageBackgroundProps> = () => {
    const background = useCustomSelector(
        (state) => state.board.pageSettings.background
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
