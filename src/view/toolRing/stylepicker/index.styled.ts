import styled from "styled-components"

export const StyledStylePicker = styled.div`
    position: fixed;
    top: 3rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    width: 70vw;
    min-width: 20rem;
    max-width: 30rem;
    background: var(--cMenuBackground);
    border-radius: var(--menubar-border-radius);
    box-shadow: var(--box-shadow);
`
