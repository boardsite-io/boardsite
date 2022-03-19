import React from "react"
import { PageSettingsWrap } from "./index.styled"
import Background from "./Background"
import Size from "./Size"

const PageSettings: React.FC = () => (
    <PageSettingsWrap>
        <Size />
        <Background />
    </PageSettingsWrap>
)

export default PageSettings
