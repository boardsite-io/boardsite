import React from "react"

import WidthPicker from "./widthpicker"
import ColorPicker from "./colorpicker"
import UndoRedo from "./undoredo"
import ToolRing from "./toolring"

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
