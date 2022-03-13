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

const menuStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    box-shadow: var(--toolbar-box-shadow);
    background: ${({ theme }) => theme.palette.primary.main};
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
    margin-left: var(--toolbar-margin);
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
