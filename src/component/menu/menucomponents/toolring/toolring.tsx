import React from "react"
import { CgErase } from "react-icons/cg"
import { BiSelection } from "react-icons/bi"
import store from "../../../../redux/store"
import { SET_TYPE } from "../../../../redux/slice/drawcontrol"
import { PenTool } from "../pentool/pentool"
import { useCustomSelector } from "../../../../redux/hooks"
import { ToolType } from "../../../../types"
import IconButton from "../iconbutton/iconbutton"

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
                <CgErase id="icon" />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Select}
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Select))
                }}>
                <BiSelection id="icon" />
            </IconButton>
        </>
    )
}

export default ToolRing
