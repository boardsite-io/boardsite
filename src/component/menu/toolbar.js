import React from "react"
import UndoRedo from "./undoredo"
import ToolRing from "./toolring"
import ColorPicker from "./colorpicker"
import WidthPicker from "./widthpicker"

function Toolbar() {
    return (
        <div className="toolbar">
            <UndoRedo />
            <ToolRing />
            <ColorPicker />
            <WidthPicker />
        </div>
    )
}
export default Toolbar
