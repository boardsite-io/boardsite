import styled, { css } from "styled-components"

interface MainMenuProps {
    open: boolean
}

export const MainMenuDropdown = styled.div<MainMenuProps>`
    ${({ theme, open }) => css`
        z-index: ${theme.zIndex.mainMenu};
        position: absolute;
        display: flex;
        flex-direction: column;
        left: ${theme.toolbar.margin};
        top: 3rem;
        height: fit-content;

        ${open
            ? css`
                  opacity: 1;
              `
            : css`
                  opacity: 0;
                  pointer-events: none;
              `};
    `}
`

const menuStyles = css`
    ${({ theme }) => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        box-shadow: ${theme.toolbar.boxShadow};
        background: ${theme.palette.primary.main};
        border-radius: ${theme.borderRadius};

        width: max-content;
        height: max-content;
    `}
`

export const MainMenuWrap = styled.ul`
    ${menuStyles};
`

export const SubMenuWrap = styled.ul`
    ${({ theme }) => css`
        ${menuStyles};
        z-index: -1; /* make transition animation go below */
        position: absolute;
        top: 0;
        left: 100%;
        margin-left: ${theme.toolbar.margin};
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
    `}
`
