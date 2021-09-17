import styled from "styled-components"

export const ToolbarStyled = styled.div`
    z-index: 100;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    gap: var(--button-gap);
    justify-content: space-between;
    padding: 0.2rem 0.4rem;
    background: var(--menubar-background);
    box-shadow: var(--menubar-box-shadow);
`
export const ToolbarGroup = styled.div`
    display: grid;
    grid-auto-flow: column;
    gap: var(--button-gap);
`
