import { Breakpoint } from "App/theme"
import styled from "styled-components"

export const OnlineSessionOptions = styled.div`
    display: grid;
    gap: 1rem;

    @media (min-width: ${Breakpoint.Md}) {
        grid-auto-flow: row;
        justify-content: space-between;
        align-items: center;
        grid-template-columns: repeat(2, 1fr);
    }
`
