import React from "react"
import { useCustomSelector } from "redux/hooks"
import { pageType } from "consts"
import store from "redux/store"
import { SET_PAGE_BACKGROUND } from "redux/board/board"
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
                $active={background === pageType.BLANK}
                onClick={() =>
                    store.dispatch(SET_PAGE_BACKGROUND(pageType.BLANK))
                }
            />
            <Checkered
                $active={background === pageType.CHECKERED}
                onClick={() =>
                    store.dispatch(SET_PAGE_BACKGROUND(pageType.CHECKERED))
                }
            />
            <Ruled
                $active={background === pageType.RULED}
                onClick={() =>
                    store.dispatch(SET_PAGE_BACKGROUND(pageType.RULED))
                }
            />
        </Backgrounds>
    )
}

export default PageBackgrounds
