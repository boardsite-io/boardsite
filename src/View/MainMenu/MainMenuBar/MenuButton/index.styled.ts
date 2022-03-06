import styled from "styled-components"
import { MainMenuButton } from "../index.styled"

export const StyledMainMenuButton = styled(MainMenuButton)`
    margin-right: 0.6rem;
    padding: var(--icon-button-padding);
    height: var(--icon-button-size);
    width: var(--icon-button-size);

    svg {
        width: 80%;
        height: 80%;
    }
`
