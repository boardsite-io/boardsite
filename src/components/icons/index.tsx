import React, { FC } from "react"
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
    id?: string
}
const EraserIcon: FC<IconProps> = (props) => <StyledEraser {...props} />
const PenIcon: FC<IconProps> = (props) => <StyledPen {...props} />
const SelectIcon: FC<IconProps> = (props) => <StyledSelect {...props} />
const LineIcon: FC<IconProps> = (props) => <StyledLine {...props} />
const CircleIcon: FC<IconProps> = (props) => <StyledCircle {...props} />
const RectangleIcon: FC<IconProps> = (props) => <StyledSquare {...props} />
const PlusIcon: FC<IconProps> = (props) => <StyledPlus {...props} />
const MinusIcon: FC<IconProps> = (props) => <StyledMinus {...props} />
const ExpandIcon: FC<IconProps> = (props) => <StyledExpand {...props} />
const ShrinkIcon: FC<IconProps> = (props) => <StyledShrink {...props} />
const PanIcon: FC<IconProps> = (props) => <StyledPan {...props} />
const ZoomInIcon: FC<IconProps> = (props) => <StyledZoomIn {...props} />
const ZoomOutIcon: FC<IconProps> = (props) => <StyledZoomOut {...props} />
const UndoIcon: FC<IconProps> = (props) => <StyledUndo {...props} />
const RedoIcon: FC<IconProps> = (props) => <StyledRedo {...props} />
const DownloadIcon: FC<IconProps> = (props) => <StyledDownload {...props} />
const UploadIcon: FC<IconProps> = (props) => <StyledUpload {...props} />

export {
    EraserIcon,
    PenIcon,
    SelectIcon,
    LineIcon,
    CircleIcon,
    RectangleIcon,
    PlusIcon,
    MinusIcon,
    ExpandIcon,
    ShrinkIcon,
    PanIcon,
    ZoomInIcon,
    ZoomOutIcon,
    UndoIcon,
    RedoIcon,
    DownloadIcon,
    UploadIcon,
}
