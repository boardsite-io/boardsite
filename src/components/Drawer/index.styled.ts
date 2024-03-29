import styled, { css } from "styled-components"

interface DrawerBoxProps {
    position: "left" | "right"
    open: boolean
}

export const DrawerBox = styled.div<DrawerBoxProps>`
    ${({ theme, open, position }) => css`
        z-index: ${theme.zIndex.drawer};
        position: fixed;
        inset-block: 0;
        width: min(20rem, 80%);
        display: flex;
        flex-direction: column;
        background: ${theme.palette.primary.main};
        padding: 0.5rem;
        box-shadow: ${theme.boxShadow};
        overflow-y: auto;
        overflow-x: hidden;
        transition: 250ms ease-in-out;
        -webkit-transition: transform 250ms;
        -webkit-transition: -webkit-transform 250ms;
        ${() => {
            if (open && position === "left") {
                return css`
                    left: 0;
                    transform: translateX(0);
                    -webkit-transform: translateX(0);
                `
            }
            if (!open && position === "left") {
                return css`
                    left: 0;
                    transform: translateX(-100%);
                    -webkit-transform: translateX(-100%);
                `
            }
            if (open && position === "right") {
                return css`
                    right: 0;
                    transform: translateX(0);
                    -webkit-transform: translateX(0);
                `
            }
            return css`
                right: 0;
                transform: translateX(100%);
                -webkit-transform: translateX(100%);
            `
        }}
    `}
`

interface DrawerBackgroundProps {
    open: boolean
}

export const DrawerBackground = styled.div<DrawerBackgroundProps>`
    ${({ theme, open }) => css`
        z-index: ${theme.zIndex.drawerBG};
        position: fixed;
        background: ${theme.dialog.background};
        inset: 0;
        transition: 250ms ease-in-out;
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

export const DrawerTitle = styled.h1`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: 0.5rem;
    svg {
        height: 1em;
        width: 1em;
        stroke: black;
    }
`
export const DrawerContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`
