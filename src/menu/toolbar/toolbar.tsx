import React from "react"
import SessionDialog from "./sessiondialog/sessiondialog"
import ViewOptions from "./viewoptions/viewoptions"
import PageOptions from "./pageoptions/pageoptions"
import { ToolbarGroup, ToolbarStyled } from "./toolbar.styled"
import Settings from "./settings/settings"
import UndoRedo from "./undoredo/undoredo"
import ToolRing from "./toolring/toolring"
import ViewZoom from "./viewzoom/viewzoom"

const Toolbar: React.FC = () => (
    <ToolbarStyled>
        <ToolbarGroup className="toolbar-general">
            <Settings />
            <SessionDialog />
        </ToolbarGroup>
        <ToolbarGroup className="toolbar-undo">
            <UndoRedo />
        </ToolbarGroup>
        <ToolbarGroup className="toolbar-toolring">
            <ToolRing />
        </ToolbarGroup>
        <ToolbarGroup className="toolbar-zoom">
            <ViewZoom />
        </ToolbarGroup>
        <ToolbarGroup className="toolbar-view">
            <PageOptions />
            <ViewOptions />
        </ToolbarGroup>
    </ToolbarStyled>
)
export default Toolbar
