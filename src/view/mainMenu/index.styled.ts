import styled, { css } from "styled-components"

interface MainMenuProps {
    open: boolean
}

export const MainMenuDropdown = styled.div<MainMenuProps>`
    z-index: var(--zIndexMainMenu);
    position: absolute;
    display: flex;
    flex-direction: column;
    left: var(--toolbar-margin);
    top: 3rem;
    height: fit-content;
    width: fit-content;

    ${({ open }) =>
        open
            ? css`
                  opacity: 1;
              `
            : css`
                  opacity: 0;
                  pointer-events: none;
              `};
`

export const MainMenuBackground = styled.div<MainMenuProps>`
    z-index: var(--zIndexMainMenuBG);
    position: fixed;
    inset: 0;
    ${({ open }) =>
        open
            ? css``
            : css`
                  pointer-events: none;
              `};
`

const menuStyles = css`
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    overflow: hidden;
    box-shadow: var(--toolbar-box-shadow);
    background: var(--cMenuBackground);
    border-radius: var(--toolbar-border-radius);

    width: max-content;
    height: max-content;
`

export const MainMenuWrap = styled.ul`
    ${menuStyles};
`

export const SubMenuWrap = styled.ul`
    ${menuStyles};
    z-index: -1; /* make transition animation go below */
    position: absolute;
    top: 0;
    left: 100%;
    margin-left: 0.2rem;
    transition: all 300ms ease;

    &.menu-enter {
        transform: translateX(-300%);
    }

    &.menu-enter-active {
        transform: translateX(0%);
    }

    &.menu-exit {
        transform: translateX(0%);
    }

    &.menu-exit-active {
        transform: translateX(-300%);
    }
`
