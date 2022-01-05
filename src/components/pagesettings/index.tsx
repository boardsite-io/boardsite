import React from "react"
import { PageSettingsInnerWrap, PageSettingsWrap } from "./index.styled"
import PageBackgrounds from "./pagebackgrounds"
import PageSizes from "./pagesizes"

const PageSettings: React.FC = () => (
    <PageSettingsWrap>
        <PageSettingsInnerWrap>
            <PageSizes />
            <PageBackgrounds />
        </PageSettingsInnerWrap>
    </PageSettingsWrap>
)

export default PageSettings
