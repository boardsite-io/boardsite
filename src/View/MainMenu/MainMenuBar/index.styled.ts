import styled from "styled-components"

export const MainMenuBarWrap = styled.nav`
    z-index: var(--zIndexMainMenu);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: var(--toolbar-margin);
    margin-left: var(--toolbar-margin);
    top: 0;
    left: 0;
    background: ${({ theme }) => theme.palette.primary.main};
    border-radius: var(--border-radius);
    box-shadow: var(--toolbar-box-shadow);
    padding: var(--toolbar-padding);
`

export const MainMenuButton = styled.button`
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: ${({ theme }) => theme.palette.primary.contrastText};
    background: ${({ theme }) => theme.palette.primary.main};
    border-radius: var(--border-radius);
    width: fit-content;
    height: var(--icon-button-size);
    margin: var(--icon-button-margin);
    padding: 0 0.2rem;
    transition: all 100ms ease-in-out;

    &:hover {
        filter: var(--main-menu-hover-filter);
    }

    svg {
        height: 80%;
        width: 80%;
    }
`
