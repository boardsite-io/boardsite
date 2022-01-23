import styled from "styled-components"

export const FavToolsStyled = styled.div`
    z-index: 10;
    background: var(--cMenuBackground);
    display: grid;
    grid-auto-flow: row;
    position: fixed;
    gap: 10px; /* var(--button-gap); */
    padding: var(--menu-padding);
    border-top-right-radius: var(--menubar-border-radius);
    border-bottom-right-radius: var(--menubar-border-radius);
    justify-content: space-between;
    top: 50%;
    transform: translateY(-50%);
    left: 0px;
    box-shadow: var(--menubar-box-shadow);
`
