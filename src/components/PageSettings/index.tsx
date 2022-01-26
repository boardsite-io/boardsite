import React from "react"
import { PageSettingsInnerWrap, PageSettingsWrap } from "./index.styled"
import Background from "./Background"
import Size from "./Size"

const PageSettings: React.FC = () => (
    <PageSettingsWrap>
        <PageSettingsInnerWrap>
            <Size />
            <Background />
        </PageSettingsInnerWrap>
    </PageSettingsWrap>
)

export default PageSettings
