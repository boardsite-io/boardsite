import styled from "styled-components"

export const FavToolWrapper = styled.div`
    position: relative;
`

export const FavToolOptions = styled.div`
    position: absolute;
    bottom: 0;
    left: 3rem;
    display: grid;
    grid-auto-flow: column;
    border-radius: var(--menubar-border-radius);
    background-color: var(--cMenuBackground);
    box-shadow: var(--menubar-box-shadow);
`
