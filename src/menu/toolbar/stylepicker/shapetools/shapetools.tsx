import React from "react"
import { useCustomSelector } from "redux/hooks"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    SquareIcon,
} from "components"
import { SET_TYPE } from "redux/drawing/drawing"
import store from "redux/store"
import { ToolType } from "drawing/stroke/types"
import { StyledShapeTools } from "./shapetools.styled"

const ShapeTools: React.FC = () => {
    const typeSelector = useCustomSelector((state) => state.drawing.tool.type)
    const colorSelector = useCustomSelector(
        (state) => state.drawing.tool.style.color
    )
    return (
        <StyledShapeTools>
            <IconButton
                active={typeSelector === ToolType.Pen}
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Pen))
                }}
                style={
                    typeSelector === ToolType.Pen
                        ? { background: colorSelector }
                        : undefined
                }>
                <PenIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Line}
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Line))
                }}
                style={
                    typeSelector === ToolType.Line
                        ? { background: colorSelector }
                        : undefined
                }>
                <LineIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Rectangle}
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Rectangle))
                }}
                style={
                    typeSelector === ToolType.Rectangle
                        ? { background: colorSelector }
                        : undefined
                }>
                <SquareIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Circle}
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Circle))
                }}
                style={
                    typeSelector === ToolType.Circle
                        ? { background: colorSelector }
                        : undefined
                }>
                <CircleIcon />
            </IconButton>
        </StyledShapeTools>
    )
}

export default ShapeTools
