import styled from "styled-components"
import { Canvas } from "../index.styled"

export const CanvasBG = styled(Canvas)`
    background: ${({ theme }) => theme.palette.editor.paper};
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
`
