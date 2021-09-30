import React from "react"
import { useCustomSelector } from "redux/hooks"
import { EraserIcon, IconButton, PanIcon, SelectIcon } from "components"
import store from "redux/store"
import { ToolType } from "drawing/stroke/types"
import { SET_TYPE } from "redux/slice/drawcontrol"
import PenTool from "../pentool/pentool"

const ToolRing: React.FC = () => {
    const typeSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.type
    )

    return (
        <>
            <PenTool />
            <IconButton
                active={typeSelector === ToolType.Eraser}
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Eraser))
                }}>
                <EraserIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Select}
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Select))
                }}>
                <SelectIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Pan}
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Pan))
                }}>
                <PanIcon />
            </IconButton>
        </>
    )
}

export default ToolRing
