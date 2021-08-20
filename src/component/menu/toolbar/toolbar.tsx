import React from "react"
import Settings from "../menucomponents/settings/settings"
import UndoRedo from "../menucomponents/undoredo/undoredo"
import ToolRing from "../menucomponents/toolring/toolring"
import SessionDialog from "../menucomponents/sessiondialog/sessiondialog"
import ViewZoom from "../menucomponents/viewzoom/viewzoom"
import ViewOptions from "../menucomponents/viewoptions/viewoptions"
import PageOptions from "../menucomponents/pageoptions/pageoptions"
import { ToolbarGroup, ToolbarStyled } from "./toolbar.styled"

const Toolbar: React.FC = () => (
    <ToolbarStyled>
        <ToolbarGroup>
            <Settings />
            <SessionDialog />
            <PageOptions />
        </ToolbarGroup>
        <ToolbarGroup>
            <UndoRedo />
        </ToolbarGroup>
        <ToolbarGroup>
            <ToolRing />
        </ToolbarGroup>
        <ToolbarGroup>
            <ViewZoom />
        </ToolbarGroup>
        <ToolbarGroup>
            <ViewOptions />
        </ToolbarGroup>
    </ToolbarStyled>
)
export default Toolbar
