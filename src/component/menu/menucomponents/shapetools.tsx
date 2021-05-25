import React from "react"
import { FiMinus, FiCircle, FiSquare } from "react-icons/fi"
import { BsPencil } from "react-icons/bs"

import { toolType } from "../../../constants"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import { useCustomSelector } from "../../../redux/hooks"

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
                    typeSelector === toolType.PEN
                        ? { color: colorSelector }
                        : {}
                }
                id={
                    typeSelector === toolType.PEN
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(toolType.PEN))
                }}>
                <BsPencil id="icon" />
            </button>
            <button
                type="button"
                style={
                    typeSelector === toolType.LINE
                        ? { color: colorSelector }
                        : {}
                }
                id={
                    typeSelector === toolType.LINE
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(toolType.LINE))
                }}>
                <FiMinus id="icon" />
            </button>
            <button
                type="button"
                style={
                    typeSelector === toolType.RECTANGLE
                        ? { color: colorSelector }
                        : {}
                }
                id={
                    typeSelector === toolType.RECTANGLE
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(toolType.RECTANGLE))
                }}>
                <FiSquare id="icon" />
            </button>
            <button
                type="button"
                style={
                    typeSelector === toolType.CIRCLE
                        ? { color: colorSelector }
                        : {}
                }
                id={
                    typeSelector === toolType.CIRCLE
                        ? "icon-button-active"
                        : "icon-button"
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(toolType.CIRCLE))
                }}>
                <FiCircle id="icon" />
            </button>
        </div>
    )
}

export default ShapeTools
