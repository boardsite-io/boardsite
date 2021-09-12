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
    active?: boolean
}
export const EraserIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledEraser $stroke={stroke} $active={active} />
)
export const PenIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledPen $stroke={stroke} $active={active} />
)
export const SelectIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledSelect $stroke={stroke} $active={active} />
)
export const LineIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledLine $stroke={stroke} $active={active} />
)
export const CircleIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledCircle $stroke={stroke} $active={active} />
)
export const SquareIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledSquare $stroke={stroke} $active={active} />
)
export const PlusIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledPlus $stroke={stroke} $active={active} />
)
export const MinusIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledMinus $stroke={stroke} $active={active} />
)
export const ExpandIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledExpand $stroke={stroke} $active={active} />
)
export const ShrinkIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledShrink $stroke={stroke} $active={active} />
)
export const PanIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledPan $stroke={stroke} $active={active} />
)
export const ZoomInIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledZoomIn $stroke={stroke} $active={active} />
)
export const ZoomOutIcon: React.FC<ToolIconProps> = ({ stroke, active }) => (
    <StyledZoomOut $stroke={stroke} $active={active} />
)
