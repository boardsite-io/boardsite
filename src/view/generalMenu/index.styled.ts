import styled, { css } from "styled-components"

export const GeneralMenuButton = styled.div`
    z-index: 100;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    background: var(--cMenuBackground);
    border-bottom-right-radius: var(--menubar-border-radius);
    box-shadow: var(--menubar-box-shadow);
    padding: var(--menu-padding);
`

interface GeneralMenuProps {
    open: boolean
}

export const GeneralMenuDropdown = styled.div<GeneralMenuProps>`
    z-index: 1000;
    position: fixed;
    display: flex;
    flex-direction: column;
    left: 0;
    top: 2.8rem;
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

export const GeneralMenuBackground = styled.div<GeneralMenuProps>`
    z-index: 900;
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
    box-shadow: var(--box-shadow);
    background: var(--cMenuBackground);

    width: max-content;
    height: max-content;
`
export const MainMenu = styled.ul`
    ${menuStyles};
    border-radius: 0 var(--menubar-border-radius) var(--menubar-border-radius) 0;
`

export const SubMenu = styled.ul`
    ${menuStyles};
    z-index: -1; /* make transition animation go below */
    border-radius: var(--menubar-border-radius);
    position: absolute;
    top: 0;
    left: calc(100% + 0.2rem);
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

export const Divider = styled.hr`
    width: 100%;
`
