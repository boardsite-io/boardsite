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
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Eraser))
                }}>
                <EraserIcon active={typeSelector === ToolType.Eraser} />
            </IconButton>
            <IconButton
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Select))
                }}>
                <SelectIcon active={typeSelector === ToolType.Select} />
            </IconButton>
            <IconButton
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Pan))
                }}>
                <PanIcon active={typeSelector === ToolType.Pan} />
            </IconButton>
        </>
    )
}

export default ToolRing
