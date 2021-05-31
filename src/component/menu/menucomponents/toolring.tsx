import React from "react"
import { CgErase, CgController } from "react-icons/cg"
import { BiSelection } from "react-icons/bi"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import { PenTool } from "./pentool"
import { useCustomSelector } from "../../../redux/hooks"
import { ToolType } from "../../../types"

const ToolRing: React.FC = () => {
    const typeSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.type
    )

    return (
        <>
            <PenTool />
            <button
                type="button"
                id={
                    typeSelector === ToolType.Eraser
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Eraser))
                }}>
                <CgErase id="icon" />
            </button>
            <button
                type="button"
                id={
                    typeSelector === ToolType.Drag
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Drag))
                }}>
                <CgController id="icon" />
            </button>
            <button
                type="button"
                id={
                    typeSelector === ToolType.Select
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Select))
                }}>
                <BiSelection id="icon" />
            </button>
        </>
    )
}

export default ToolRing
