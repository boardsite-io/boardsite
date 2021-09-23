import styled from "styled-components"

export const ViewNavWrapper = styled.div`
    position: fixed;
    display: grid;
    grid-auto-flow: row;
    background: var(--color2);
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    border-radius: var(--menubar-border-radius);
    overflow: hidden;
    width: fit-content;
    gap: 0px;
`
export const ViewNavIconButton = styled.button`
    padding: 0px;
    text-align: center;
    height: 15px;
    width: 20px;
    border-width: 0;
    color: var(--color1);
    outline: none;
    background: none;
    margin: auto;
    &:hover {
        color: var(--color2);
        background: var(--color1);
    }
`
export const ViewNavPageNum = styled.p`
    margin: auto;
    width: fit-content;
`
export const ViewNavPageIndexButton = styled.button`
    margin: auto;
    padding-left: 2px;
    padding-right: 2px;
    text-align: center;
    font-size: 100%;
    height: fit-content;
    width: fit-content;
    min-width: 20px;
    border-width: 0;
    color: var(--color1);
    outline: none;
    background: none;
    gap: 0px;
    &:hover {
        color: var(--color2);
        background: var(--color1);
    }
`
