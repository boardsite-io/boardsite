import React from "react"
import { useSelector } from "react-redux"
import { CgErase, CgController } from "react-icons/cg"
import { BiSelection } from "react-icons/bi"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import { toolType } from "../../../constants"
import PenTool from "./pentool"
import ShapeTools from "./shapetools"

export default function ToolRing() {
    const typeSelector = useSelector(
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
            <ShapeTools />
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
