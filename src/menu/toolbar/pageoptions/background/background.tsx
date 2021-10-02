import React from "react"
import { handlePageBackground } from "drawing/handlers"
import {
    PageOptions,
    PagePreviewBlank,
    PagePreviewCheckered,
    PagePreviewRuled,
} from "./background.styled"
import { pageType } from "../../../../constants"

interface PageBackgroundProps {
    setOpenOther: React.Dispatch<React.SetStateAction<boolean>>
}

const PageBackgrounds: React.FC<PageBackgroundProps> = () => (
    <>
        <PageOptions>
            <PagePreviewBlank
                type="button"
                onClick={() => handlePageBackground(pageType.BLANK)}
            />
            <PagePreviewCheckered
                type="button"
                onClick={() => handlePageBackground(pageType.CHECKERED)}
            />
            <PagePreviewRuled
                type="button"
                onClick={() => handlePageBackground(pageType.RULED)}
            />
        </PageOptions>
    </>
)

export default PageBackgrounds
