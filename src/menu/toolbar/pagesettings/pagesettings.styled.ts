import styled, { css } from "styled-components"

export const PageOptions = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
`

const sharedStyle = css`
    /* remove a pixel for pixel perfect symmetry */
    height: calc(5rem - 1px);
    width: calc(5rem - 1px);
    outline: none;
    border-radius: var(--button-border-radius);
    border: 1px solid var(--color3);
    box-shadow: var(--box-shadow);
    &:hover {
        cursor: pointer;
    }
`

export const PagePreviewBlank = styled.button`
    ${sharedStyle}
    background: white;
`
export const PagePreviewCheckered = styled.button`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 0.95rem,
            teal 0.95rem,
            teal 1rem
        ), repeating-linear-gradient(
            white 0, 
            white 0.95rem,
            teal 0.95rem,
            teal 1rem
        );
`
export const PagePreviewRuled = styled.button`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
        white 0, 
        white 0.95rem,
        teal 0.95rem,
        teal 1rem
    );
`
