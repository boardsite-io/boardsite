import React from "react"
import {
    StyledCircle,
    StyledEraser,
    StyledExpand,
    StyledLine,
    StyledMinus,
    StyledPan,
    StyledPen,
    StyledPlus,
    StyledSelect,
    StyledShrink,
    StyledSquare,
    StyledZoomIn,
    StyledZoomOut,
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
export const PlusIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledPlus stroke={stroke} />
)
export const MinusIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledMinus stroke={stroke} />
)
export const ExpandIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledExpand stroke={stroke} />
)
export const ShrinkIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledShrink stroke={stroke} />
)
export const PanIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledPan stroke={stroke} />
)
export const ZoomInIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledZoomIn stroke={stroke} />
)
export const ZoomOutIcon: React.FC<ToolIconProps> = ({ stroke = "white" }) => (
    <StyledZoomOut stroke={stroke} />
)
