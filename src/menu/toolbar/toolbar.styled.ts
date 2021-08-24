import styled from "styled-components"

export const ToolbarStyled = styled.div`
    background: var(--menubar-background);
    display: grid;
    grid-auto-flow: column;
    position: fixed;
    gap: var(--button-gap);
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 5px;
    padding-right: 5px;
    justify-content: space-between;
    top: 0px;
    left: 0px;
    right: 0px;
    box-shadow: var(--menubar-box-shadow);
`
export const ToolbarGroup = styled.div`
    display: grid;
    grid-auto-flow: column;
    gap: var(--button-gap);
`
