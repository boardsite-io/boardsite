import styled, { css } from "styled-components"

interface DialogProps {
    open: boolean
}

export const DialogBox = styled.div<DialogProps>`
    ${({ theme, open }) => css`
        z-index: ${theme.zIndex.dialog};
        display: flex;
        flex-direction: column;
        position: fixed;
        background: ${theme.palette.primary.main};
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: min(90vw, 25rem);
        max-height: 90vh;
        border-radius: ${theme.borderRadius};
        box-shadow: ${theme.boxShadow};
        transition: 250ms ease-in-out;
        ${open
            ? css`
                  opacity: 1;
              `
            : css`
                  visibility: hidden;
                  opacity: 0;
                  pointer-events: none;
              `};
    `}
`

export const DialogBackground = styled.div<DialogProps>`
    ${({ theme, open }) => css`
        z-index: ${theme.zIndex.dialogBG};
        position: fixed;
        background: ${theme.dialog.background};
        inset: 0;
        transition: 250ms ease-in-out;
        ${open
            ? css`
                  opacity: 1;
              `
            : css`
                  visibility: hidden;
                  opacity: 0;
                  pointer-events: none;
              `};
    `}
`

export const DialogContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem;
`

export const DialogTitle = styled.h1`
    margin: 1rem;
`

export const DialogOptions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin: 0.5rem;
`
