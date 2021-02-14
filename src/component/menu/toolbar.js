import React from "react"
// import UndoRedo from "./menucomponents/undoredo"
import ToolRing from "./menucomponents/toolring"
import ColorPicker from "./menucomponents/colorpicker"
import WidthPicker from "./menucomponents/widthpicker"

function Toolbar() {
    return (
        <div className="toolbar">
            {/* <UndoRedo /> */}
            <ToolRing />
            <ColorPicker />
            <WidthPicker />
        </div>
    )
}
export default Toolbar
