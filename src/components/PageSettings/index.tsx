import React from "react"
import { PageSettingsInnerWrap, PageSettingsWrap } from "./index.styled"
import PageBackground from "./PageBackground"
import PageSize from "./PageSize"

const PageSettings: React.FC = () => (
    <PageSettingsWrap>
        <PageSettingsInnerWrap>
            <PageSize />
            <PageBackground />
        </PageSettingsInnerWrap>
    </PageSettingsWrap>
)

export default PageSettings
