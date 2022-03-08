import styled from "styled-components"
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

    color: var(--cPrimary);
    background: var(--cTertiary);
    border-radius: var(--button-border-radius);
    filter: opacity(75%);
    box-shadow: var(--box-shadow);
`

export const StyledMainMenuButton = styled(MainMenuButton)`
    cursor: pointer;
    width: var(--icon-button-size);
    padding: var(--icon-button-padding);
`
