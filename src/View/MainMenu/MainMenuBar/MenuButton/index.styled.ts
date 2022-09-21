import styled, { css } from "styled-components"
import { MainMenuButton } from "../index.styled"

export const StyledMainMenuButton = styled(MainMenuButton)`
    ${({ theme }) => css`
        cursor: pointer;
        margin-right: 0.6rem;
        padding: ${theme.iconButton.padding};
        height: ${theme.iconButton.size};
        width: ${theme.iconButton.size};

        svg {
            width: 80%;
            height: 80%;
        }
    `}
`
