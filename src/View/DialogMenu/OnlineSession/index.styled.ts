import { Breakpoint } from "App/global.styled"
import styled from "styled-components"

export const CreateSessionOptions = styled.div`
    display: grid;
    gap: 1rem;

    @media (min-width: ${Breakpoint.Md}) {
        grid-auto-flow: row;
        justify-content: space-between;
        align-items: center;
        grid-template-columns: repeat(2, 1fr);
    }
`

export const Selection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`
