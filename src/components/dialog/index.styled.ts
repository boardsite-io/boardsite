import styled, { css } from "styled-components"

interface DialogProps {
    open: boolean
}

export const DialogBox = styled.div<DialogProps>`
    z-index: 1000;
    display: flex;
    flex-direction: column;
    position: fixed;
    background: var(--color5);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: min(90vw, 40rem);
    max-height: 80vh;
    border-radius: var(--button-border-radius);
    box-shadow: var(--box-shadow);
    transition: 250ms ease-in-out;
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

export const DialogBackground = styled.div<DialogProps>`
    z-index: 900;
    position: fixed;
    background: var(--color6);
    inset: 0;
    transition: 250ms ease-in-out;
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

export const DialogContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    gap: 1rem;
    padding: 1.5rem;
    text-align: justify;
`

export const DialogTitle = styled.h2`
    margin: 1rem 1rem 0.5rem;
`

export const DialogOptions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin: 0.5rem;
`
