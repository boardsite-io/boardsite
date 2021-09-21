import styled from "styled-components"

export const FavToolWrapper = styled.div`
    position: relative;
`

export const FavToolWidth = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 0.1rem;
    height: min-content;
    width: min-content;
    color: white;
    background: rgba(0, 0, 0, 0.75);
    border-radius: var(--button-border-radius);
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 0.8rem;
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
