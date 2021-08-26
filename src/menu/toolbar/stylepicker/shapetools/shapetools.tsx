import React from "react"
import { FiMinus, FiCircle, FiSquare } from "react-icons/fi"
import { BsPencil } from "react-icons/bs"
import { useCustomSelector } from "redux/hooks"
import { IconButton } from "@components"
import { SET_TYPE } from "redux/slice/drawcontrol"
import store from "redux/store"
import { ToolType } from "types"
import { StyledShapeTools } from "./shapetools.styled"

const ShapeTools: React.FC = () => {
    const typeSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const colorSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.color
    )
    return (
        <StyledShapeTools>
            <IconButton
                style={
                    typeSelector === ToolType.Pen
                        ? { color: colorSelector }
                        : {}
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Pen))
                }}>
                <BsPencil id="icon" />
            </IconButton>
            <IconButton
                style={
                    typeSelector === ToolType.Line
                        ? { color: colorSelector }
                        : {}
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Line))
                }}>
                <FiMinus id="icon" />
            </IconButton>
            <IconButton
                style={
                    typeSelector === ToolType.Rectangle
                        ? { color: colorSelector }
                        : {}
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Rectangle))
                }}>
                <FiSquare id="icon" />
            </IconButton>
            <IconButton
                style={
                    typeSelector === ToolType.Circle
                        ? { color: colorSelector }
                        : {}
                }
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Circle))
                }}>
                <FiCircle id="icon" />
            </IconButton>
        </StyledShapeTools>
    )
}

export default ShapeTools
