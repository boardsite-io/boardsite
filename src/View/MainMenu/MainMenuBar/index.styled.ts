import styled, { css } from "styled-components"

export const MainMenuBarWrap = styled.nav`
    ${({ theme }) => css`
        z-index: ${theme.zIndex.mainMenu};
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: ${theme.toolbar.margin};
        margin-left: ${theme.toolbar.margin};
        box-shadow: ${theme.toolbar.boxShadow};
        padding: ${theme.toolbar.padding};
        top: 0;
        left: 0;
        background: ${theme.palette.primary.main};
        border-radius: ${theme.borderRadius};
    `}
`

export const MainMenuButton = styled.button`
    ${({ theme }) => css`
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        color: ${theme.palette.primary.contrastText};
        background: ${theme.palette.primary.main};
        border-radius: ${theme.borderRadius};
        width: fit-content;
        height: ${theme.iconButton.size};
        margin: ${theme.iconButton.margin};
        padding: 0 0.2rem;
        transition: all 100ms ease-in-out;

        &:hover {
            filter: ${theme.menuButton.hoverFilter};
        }

        svg {
            height: 80%;
            width: 80%;
        }
    `}
`
