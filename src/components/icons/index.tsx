import React from "react"
import {
    StyledCircle,
    StyledDownload,
    StyledEraser,
    StyledExpand,
    StyledLine,
    StyledMinus,
    StyledPan,
    StyledPen,
    StyledPlus,
    StyledRedo,
    StyledSelect,
    StyledShrink,
    StyledSquare,
    StyledUndo,
    StyledUpload,
    StyledZoomIn,
    StyledZoomOut,
} from "./index.styled"

export interface IconProps {
    stroke?: string
    active?: boolean
}
export const EraserIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledEraser $stroke={stroke} $active={active} />
)
export const PenIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledPen $stroke={stroke} $active={active} />
)
export const SelectIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledSelect $stroke={stroke} $active={active} />
)
export const LineIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledLine $stroke={stroke} $active={active} />
)
export const CircleIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledCircle $stroke={stroke} $active={active} />
)
export const SquareIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledSquare $stroke={stroke} $active={active} />
)
export const PlusIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledPlus $stroke={stroke} $active={active} />
)
export const MinusIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledMinus $stroke={stroke} $active={active} />
)
export const ExpandIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledExpand $stroke={stroke} $active={active} />
)
export const ShrinkIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledShrink $stroke={stroke} $active={active} />
)
export const PanIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledPan $stroke={stroke} $active={active} />
)
export const ZoomInIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledZoomIn $stroke={stroke} $active={active} />
)
export const ZoomOutIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledZoomOut $stroke={stroke} $active={active} />
)
export const UndoIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledUndo $stroke={stroke} $active={active} />
)
export const RedoIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledRedo $stroke={stroke} $active={active} />
)
export const DownloadIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledDownload $stroke={stroke} $active={active} />
)
export const UploadIcon: React.FC<IconProps> = ({ stroke, active }) => (
    <StyledUpload $stroke={stroke} $active={active} />
)
