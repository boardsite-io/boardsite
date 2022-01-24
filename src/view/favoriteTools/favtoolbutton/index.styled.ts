import styled from "styled-components"

export const FavToolWrapper = styled.div`
    position: relative;
`

export const FavToolOptions = styled.div`
    position: fixed;
    bottom: 3.1rem;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-auto-flow: column;
    border-radius: var(--border-radius);
    background-color: var(--cMenuBackground);
    box-shadow: var(--toolbar-box-shadow);
`
