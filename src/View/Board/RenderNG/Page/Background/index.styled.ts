import styled from "styled-components"
import { Canvas } from "../index.styled"

export const CanvasBG = styled(Canvas)`
    background: ${({ theme }) => theme.palette.editor.paper};
    box-shadow: var(--page-box-shadow);
`
