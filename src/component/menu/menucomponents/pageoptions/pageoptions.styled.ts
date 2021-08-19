import styled from "styled-components"

export const PageOptionsWrapper = styled.div`
    display: grid;
    height: var(--button-height);
    grid-auto-flow: column;
    gap: var(--button-gap);
`

export const PageOptionsWrapperInner = styled.div`
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 5px;
    padding-right: 5px;
    position: absolute;
    top: 40px;
    left: -5px;
    display: grid;
    grid-auto-flow: column;
    border-radius: var(--menubar-border-radius);
    background-color: var(--menubar-background);
`
