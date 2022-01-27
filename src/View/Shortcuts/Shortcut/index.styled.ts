import styled from "styled-components"

export const Item = styled.li`
    list-style: none;
    color: var(--cSecondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin: 0;
    gap: 1rem;
`

export const Title = styled.span``
export const Keys = styled.span`
    text-overflow: ellipsis;
    background: var(--cSelected);
    padding: var(--main-menu-button-padding);
    margin: var(--main-menu-button-margin);
    border-radius: var(--button-border-radius);
`
