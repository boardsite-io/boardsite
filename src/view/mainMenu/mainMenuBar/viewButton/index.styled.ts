import styled from "styled-components"

export const ViewButtonWrap = styled.button`
    border: none;
    background: var(--cMenuBackground);
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    border-width: 0;
    border-radius: var(--button-border-radius);
    transition: all 100ms ease-in-out;

    &:hover {
        filter: var(--main-menu-hover-filter);
    }
`
