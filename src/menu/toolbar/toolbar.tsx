import React from "react"
import SessionDialog from "./sessiondialog/sessiondialog"
import ViewOptions from "./viewoptions/viewoptions"
import PageOptions from "./pageoptions/pageoptions"
import { ToolbarGroup, ToolbarStyled } from "./toolbar.styled"
import Settings from "./settings/settings"
import UndoRedo from "./undoredo/undoredo"
import ToolRing from "./toolring/toolring"
import ViewZoom from "./viewzoom/viewzoom"
import FileDropButton from "./filedropbutton/filedropbutton"

const Toolbar: React.FC = () => (
    <ToolbarStyled>
        <ToolbarGroup>
            <Settings />
            <SessionDialog />
            <PageOptions />
            <FileDropButton />
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
