import React from "react"
import { handlePageBackground } from "drawing/handlers"
import { useCustomSelector } from "redux/hooks"
import { Backgrounds, Blank, Checkered, Ruled } from "./background.styled"
import { pageType } from "../../../../constants"

interface PageBackgroundProps {
    setOpenOther: React.Dispatch<React.SetStateAction<boolean>>
}

const PageBackgrounds: React.FC<PageBackgroundProps> = () => {
    const { background } = useCustomSelector(
        (state) => state.boardControl.pageSettings
    )

    return (
        <Backgrounds>
            <Blank
                $active={background === pageType.BLANK}
                type="button"
                onClick={() => handlePageBackground(pageType.BLANK)}
            />
            <Checkered
                $active={background === pageType.CHECKERED}
                type="button"
                onClick={() => handlePageBackground(pageType.CHECKERED)}
            />
            <Ruled
                $active={background === pageType.RULED}
                type="button"
                onClick={() => handlePageBackground(pageType.RULED)}
            />
        </Backgrounds>
    )
}

export default PageBackgrounds