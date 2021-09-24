import React from "react"
import { useCustomSelector } from "redux/hooks"
import { EraserIcon, IconButton, SelectIcon } from "components"
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
                <EraserIcon
                    stroke={
                        typeSelector === ToolType.Eraser ? "black" : undefined
                    }
                />
            </IconButton>
            <IconButton
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Select))
                }}>
                <SelectIcon
                    stroke={
                        typeSelector === ToolType.Select ? "black" : undefined
                    }
                />
            </IconButton>
        </>
    )
}

export default ToolRing
