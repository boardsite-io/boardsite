import React from "react"
import Settings from "./menucomponents/settings"
import UndoRedo from "./menucomponents/undoredo"
import ToolRing from "./menucomponents/toolring"
import SessionDialog from "./menucomponents/sessiondialog"
import ViewZoom from "./menucomponents/viewzoom"
import ViewOptions from "./menucomponents/viewoptions"
import AllPagesOptions from "./menucomponents/allpagesoptions"
import PageOptions from "./menucomponents/pageoptions"

function Toolbar() {
    return (
        <div className="toolbar">
            <Settings />
            <SessionDialog />
            <AllPagesOptions />
            <UndoRedo />
            <ToolRing />
            <PageOptions />
            <ViewZoom />
            <ViewOptions />
        </div>
    )
}
export default Toolbar
