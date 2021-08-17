import React from "react"
import { FiMinus, FiCircle, FiSquare } from "react-icons/fi"
import { BsPencil } from "react-icons/bs"
import { SET_TYPE } from "../../../../../redux/slice/drawcontrol"
import { useCustomSelector } from "../../../../../redux/hooks"
import { ToolType } from "../../../../../types"
import store from "../../../../../redux/store"
import { StyledShapeTools } from "./shapetools.styled"
import IconButton from "../../iconbutton/iconbutton"

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
