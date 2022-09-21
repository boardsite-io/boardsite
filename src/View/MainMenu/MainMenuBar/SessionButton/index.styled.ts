import styled, { css } from "styled-components"
import { MainMenuButton } from "../index.styled"

export const SessionStatus = styled.div`
    position: absolute;
    bottom: 0;
    right: -0.5rem;
    display: flex;
    touch-action: none;
    pointer-events: none;
    text-align: center;
    bottom: -0.2rem;
    right: -0.45rem;
    padding: 0 0.3rem;

    color: ${({ theme }) => theme.palette.secondary.contrastText};
    background: ${({ theme }) => theme.palette.secondary.main};
    border-radius: ${({ theme }) => theme.borderRadius};
    filter: opacity(75%);
    box-shadow: ${({ theme }) => theme.boxShadow};
`

export const StyledMainMenuButton = styled(MainMenuButton)`
    ${({ theme }) => css`
        cursor: pointer;
        width: ${theme.iconButton.size};
        padding: ${theme.iconButton.padding};
    `}
`
