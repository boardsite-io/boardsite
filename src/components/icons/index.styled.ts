import styled, { css } from "styled-components"
import { ReactComponent as Eraser } from "./svgs/eraser.svg"
import { ReactComponent as Pen } from "./svgs/pen.svg"
import { ReactComponent as Select } from "./svgs/select.svg"
import { ReactComponent as Line } from "./svgs/line.svg"
import { ReactComponent as Circle } from "./svgs/circle.svg"
import { ReactComponent as Square } from "./svgs/square.svg"
import { ReactComponent as Plus } from "./svgs/plus.svg"
import { ReactComponent as Minus } from "./svgs/minus.svg"
import { ReactComponent as Expand } from "./svgs/expand.svg"
import { ReactComponent as Shrink } from "./svgs/shrink.svg"
import { ReactComponent as Pan } from "./svgs/pan.svg"
import { ReactComponent as ZoomIn } from "./svgs/zoomin.svg"
import { ReactComponent as ZoomOut } from "./svgs/zoomout.svg"
import { ReactComponent as Undo } from "./svgs/undo.svg"
import { ReactComponent as Redo } from "./svgs/redo.svg"
import { ReactComponent as Download } from "./svgs/download.svg"
import { ReactComponent as Upload } from "./svgs/upload.svg"

interface Props {
    $active?: boolean
    $stroke?: string
}
const iconStyles = css<Props>`
    height: 100%;
    width: 100%;
    stroke: ${({ $active, $stroke }) => {
        if ($active) {
            return "var(--color7)"
        }
        if ($stroke) {
            return $stroke
        }
        return "var(--color1)"
    }};
`

export const StyledEraser = styled(Eraser)`
    ${iconStyles}
`
export const StyledPen = styled(Pen)`
    ${iconStyles}
`
export const StyledSelect = styled(Select)`
    ${iconStyles}
`
export const StyledLine = styled(Line)`
    ${iconStyles}
`
export const StyledCircle = styled(Circle)`
    ${iconStyles}
`
export const StyledSquare = styled(Square)`
    ${iconStyles}
`
export const StyledPlus = styled(Plus)`
    ${iconStyles}
`
export const StyledMinus = styled(Minus)`
    ${iconStyles}
`
export const StyledExpand = styled(Expand)`
    ${iconStyles}
`
export const StyledShrink = styled(Shrink)`
    ${iconStyles}
`
export const StyledPan = styled(Pan)`
    ${iconStyles}
`
export const StyledZoomIn = styled(ZoomIn)`
    ${iconStyles}
`
export const StyledZoomOut = styled(ZoomOut)`
    ${iconStyles}
`
export const StyledUndo = styled(Undo)`
    ${iconStyles}
`
export const StyledRedo = styled(Redo)`
    ${iconStyles}
`
export const StyledDownload = styled(Download)`
    ${iconStyles}
`
export const StyledUpload = styled(Upload)`
    ${iconStyles}
`
