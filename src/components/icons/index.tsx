import React from "react"
import {
    StyledCircle,
    StyledEraser,
    StyledLine,
    StyledPen,
    StyledSelect,
    StyledSquare,
} from "./index.styled"

export interface ToolIconProps {
    stroke?: string
}
export const EraserIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledEraser stroke={stroke} />
)
export const PenIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledPen stroke={stroke} />
)
export const SelectIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledSelect stroke={stroke} />
)
export const LineIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledLine stroke={stroke} />
)
export const CircleIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledCircle stroke={stroke} />
)
export const SquareIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledSquare stroke={stroke} />
)
