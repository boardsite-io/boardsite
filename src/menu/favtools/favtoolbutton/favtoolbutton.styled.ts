import styled from "styled-components"

export const FavToolWrapper = styled.div`
    position: relative;
`

export const FavToolWidth = styled.div`
    touch-action: none;
    pointer-events: none;
    position: absolute;
    bottom: -0.2rem;
    right: -0.2rem;
    padding: 0 0.15rem;
    color: var(--color1);
    background: var(--color2);
    border-radius: var(--button-border-radius);
    text-align: center;
`
export const FavToolOptions = styled.div`
    position: absolute;
    bottom: 0;
    left: 3rem;
    display: grid;
    grid-auto-flow: column;
    border-radius: var(--menubar-border-radius);
    background-color: var(--color2);
    box-shadow: var(--menubar-box-shadow);
`
