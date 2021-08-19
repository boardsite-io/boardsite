import styled from "styled-components"

export const FavToolWrapper = styled.div`
    position: relative;
    height: var(--button-height);
`

export const FavToolWidth = styled.div`
    background: rgba(0, 0, 0, 0.733);
    border-radius: var(--button-border-radius);
    height: 13px;
    width: 13px;
    position: absolute;
    bottom: -3px;
    right: -3px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    text-align: center;
    font-size: 12px;
`
export const FavToolOptions = styled.div`
    position: absolute;
    bottom: 3px; /* same as above bottom */
    left: 45px;
    display: grid;
    grid-auto-flow: column;
    border-radius: var(--menubar-border-radius);
    background-color: var(--menubar-background);
    box-shadow: var(--menubar-box-shadow);
`
