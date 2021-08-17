import React from "react"
import Settings from "../menucomponents/settings/settings"
import UndoRedo from "../menucomponents/undoredo/undoredo"
import ToolRing from "../menucomponents/toolring/toolring"
import SessionDialog from "../menucomponents/sessiondialog/sessiondialog"
import ViewZoom from "../menucomponents/viewzoom/viewzoom"
import ViewOptions from "../menucomponents/viewoptions/viewoptions"
import PageOptions from "../menucomponents/pageoptions/pageoptions"

const Toolbar: React.FC = () => (
    <div className="toolbar">
        <div className="toolbar-group">
            <Settings />
            <SessionDialog />
            <PageOptions />
        </div>
        <div className="toolbar-group">
            <UndoRedo />
        </div>
        <div className="toolbar-group">
            <ToolRing />
        </div>
        <div className="toolbar-group">
            <ViewZoom />
        </div>
        <div className="toolbar-group">
            <ViewOptions />
        </div>
    </div>
)
export default Toolbar
