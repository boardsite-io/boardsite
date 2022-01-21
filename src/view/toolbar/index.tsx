import React, { memo } from "react"
import GeneralMenu from "./generalMenu"
import { ToolbarGroup, ToolbarStyled } from "./index.styled"
import ToolRing from "./toolring/toolring"

const Toolbar: React.FC = memo(() => (
    <ToolbarStyled>
        <ToolbarGroup className="toolbar-general">
            <GeneralMenu />
        </ToolbarGroup>
        <ToolbarGroup className="toolbar-toolring">
            <ToolRing />
        </ToolbarGroup>
    </ToolbarStyled>
))
export default Toolbar
