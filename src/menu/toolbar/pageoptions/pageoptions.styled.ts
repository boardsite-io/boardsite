import styled from "styled-components"

export const PageOptionsWrapper = styled.div`
    position: relative;
    height: var(--button-height);
    gap: var(--button-gap);
`

export const PageOptionsWrapperInner = styled.div`
    position: absolute;
    top: 1rem;
    /* compensate menu padding to align left icon with icon above */
    left: calc(-1 * var(--menu-padding));
    display: flex;
    padding: var(--menu-padding);
    border-radius: var(--menubar-border-radius);
    background: var(--color2);
`
