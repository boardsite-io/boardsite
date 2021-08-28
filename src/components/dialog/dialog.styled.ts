import styled from "styled-components"

export const DialogBox = styled.div`
    position: fixed;
    background: white;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    min-width: 30rem;
    width: fit-content;
    max-width: 60rem;
    height: fit-content;
    max-height: 80vh;
    border-radius: var(--button-border-radius);
    box-shadow: var(--box-shadow);
    overflow-y: scroll;
`

export const DialogBackground = styled.div`
    position: fixed;
    background: #000000bb;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 900;
`
