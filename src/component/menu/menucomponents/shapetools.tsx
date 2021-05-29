import React from "react"
import { FiMinus, FiCircle, FiSquare } from "react-icons/fi"
import { BsPencil } from "react-icons/bs"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import { useCustomSelector } from "../../../redux/hooks"
import { ToolType } from "../../../types"

const ShapeTools: React.FC = () => {
    const typeSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const colorSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.color
    )
    return (
        <div className="shapetools">
            <button
                type="button"
                style={
                    typeSelector === ToolType.Pen
                        ? { color: colorSelector }
                        : {}
                }
                id={
                    typeSelector === ToolType.Pen
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Pen))
                }}>
                <BsPencil id="icon" />
            </button>
            <button
                type="button"
                style={
                    typeSelector === ToolType.Line
                        ? { color: colorSelector }
                        : {}
                }
                id={
                    typeSelector === ToolType.Line
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Line))
                }}>
                <FiMinus id="icon" />
            </button>
            <button
                type="button"
                style={
                    typeSelector === ToolType.Rectangle
                        ? { color: colorSelector }
                        : {}
                }
                id={
                    typeSelector === ToolType.Rectangle
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Rectangle))
                }}>
                <FiSquare id="icon" />
            </button>
            <button
                type="button"
                style={
                    typeSelector === ToolType.Circle
                        ? { color: colorSelector }
                        : {}
                }
                id={
                    typeSelector === ToolType.Circle
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Circle))
                }}>
                <FiCircle id="icon" />
            </button>
        </div>
    )
}

export default ShapeTools
