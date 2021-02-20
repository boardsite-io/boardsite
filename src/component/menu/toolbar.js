import React from "react"
import Settings from "./menucomponents/settings"
import UndoRedo from "./menucomponents/undoredo"
import ToolRing from "./menucomponents/toolring"
import SessionDialog from "./menucomponents/sessiondialog"
import ViewZoom from "./menucomponents/viewzoom"
import ViewOptions from "./menucomponents/viewoptions"
import PageOptions from "./menucomponents/pageoptions"

function Toolbar() {
    return (
        <div className="toolbar">
            <div className="mainoptions">
                <Settings />
                <SessionDialog />
                <PageOptions />
            </div>
            <UndoRedo />
            <ToolRing />
            <ViewZoom />
            <ViewOptions />
        </div>
    )
}
export default Toolbar
