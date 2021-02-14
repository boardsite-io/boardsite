import React from "react"
import UndoRedo from "./menucomponents/undoredo"
import ToolRing from "./menucomponents/toolring"
import ColorPicker from "./menucomponents/colorpicker"
import WidthPicker from "./menucomponents/widthpicker"
import SessionDialog from "./menucomponents/sessiondialog"

function Toolbar() {
    return (
        <div className="toolbar">
            <SessionDialog />
            <UndoRedo />
            <ToolRing />
            <ColorPicker />
            <WidthPicker />
        </div>
    )
}
export default Toolbar
