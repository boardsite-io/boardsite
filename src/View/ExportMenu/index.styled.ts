import styled from "styled-components"
import { ScreenSize } from "App/theme"

export const ExportOptions = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    /* Keep media query ready for later optimisation */
    /* @media (min-width: ${ScreenSize.Sm}) {
        grid-template-columns: 1fr 1fr;
    } */
`

export const ExportDescription = styled.p`
    margin-top: 0;
`
