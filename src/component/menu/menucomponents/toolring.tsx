import React from "react"
import { CgErase, CgController } from "react-icons/cg"
import { BiSelection } from "react-icons/bi"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import { toolType } from "../../../constants"
import { PenTool } from "./pentool"
import { useCustomSelector } from "../../../redux/hooks"

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
                    typeSelector === toolType.ERASER
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(toolType.ERASER))
                }}>
                <CgErase id="icon" />
            </button>
            <button
                type="button"
                id={
                    typeSelector === toolType.DRAG
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(toolType.DRAG))
                }}>
                <CgController id="icon" />
            </button>
            <button
                type="button"
                id={
                    typeSelector === toolType.SELECT
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(toolType.SELECT))
                }}>
                <BiSelection id="icon" />
            </button>
        </>
    )
}

export default ToolRing
