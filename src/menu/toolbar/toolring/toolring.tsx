import React from "react"
import { useCustomSelector } from "redux/hooks"
import { EraserIcon, IconButton, PanIcon, SelectIcon } from "components"
import { handleSetTool } from "drawing/handlers"
import { ToolType } from "drawing/stroke/types"
import PenTool from "../pentool/pentool"

const ToolRing: React.FC = () => {
    const typeSelector = useCustomSelector(
        (state) => state.drawing.liveStroke.type
    )

    return (
        <>
            <PenTool />
            <IconButton
                active={typeSelector === ToolType.Eraser}
                onClick={() => handleSetTool({ type: ToolType.Eraser })}>
                <EraserIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Select}
                onClick={() => handleSetTool({ type: ToolType.Select })}>
                <SelectIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Pan}
                onClick={() => handleSetTool({ type: ToolType.Pan })}>
                <PanIcon />
            </IconButton>
        </>
    )
}

export default ToolRing
