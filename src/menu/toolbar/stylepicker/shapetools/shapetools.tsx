import React from "react"
import { useCustomSelector } from "redux/hooks"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    SquareIcon,
} from "components"
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
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Pen))
                }}>
                <PenIcon
                    stroke={
                        typeSelector === ToolType.Pen
                            ? colorSelector
                            : undefined
                    }
                />
            </IconButton>
            <IconButton
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Line))
                }}>
                <LineIcon
                    stroke={
                        typeSelector === ToolType.Line
                            ? colorSelector
                            : undefined
                    }
                />
            </IconButton>
            <IconButton
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Rectangle))
                }}>
                <SquareIcon
                    stroke={
                        typeSelector === ToolType.Rectangle
                            ? colorSelector
                            : undefined
                    }
                />
            </IconButton>
            <IconButton
                onClick={() => {
                    store.dispatch(SET_TYPE(ToolType.Circle))
                }}>
                <CircleIcon
                    stroke={
                        typeSelector === ToolType.Circle
                            ? colorSelector
                            : undefined
                    }
                />
            </IconButton>
        </StyledShapeTools>
    )
}

export default ShapeTools
