import styled, { css } from "styled-components"
import { ReactComponent as Eraser } from "./eraser.svg"
import { ReactComponent as Pen } from "./pen.svg"
import { ReactComponent as Select } from "./select.svg"
import { ReactComponent as Line } from "./line.svg"
import { ReactComponent as Circle } from "./circle.svg"
import { ReactComponent as Square } from "./square.svg"

const iconStyles = css`
    height: 100%;
    width: 100%;
    &:hover {
        stroke: black;
    }
    /* margin: auto; */
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
