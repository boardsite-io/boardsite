import styled from "styled-components"

export const DialogBox = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    background: var(--color5);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: min(90vw, 40rem);
    max-height: 80vh;
    border-radius: var(--button-border-radius);
    box-shadow: var(--box-shadow);
`

export const DialogBackground = styled.div`
    position: fixed;
    background: var(--color6);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 900;
`

export const DialogContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    gap: 1rem;
    margin: 1.5rem;
    text-align: justify;
`

export const DialogTitle = styled.h2`
    margin: 1.3rem 1rem;
`

export const DialogOptions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin: 0.5rem;
`
