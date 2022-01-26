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
    background: var(--cPrimary);
    border-radius: var(--toolbar-border-radius);
    box-shadow: var(--toolbar-box-shadow);
    padding: var(--toolbar-padding);
`

export const MainMenuButton = styled.button`
    border: none;
    color: var(--cSecondary);
    background: var(--cPrimary);
    border-radius: var(--button-border-radius);
    height: var(--icon-button-size);
    margin: var(--icon-button-margin);
    padding: var(--icon-button-padding);
    transition: all 100ms ease-in-out;

    &:hover {
        filter: var(--main-menu-hover-filter);
    }
`
