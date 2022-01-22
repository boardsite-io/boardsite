import styled from "styled-components"

export const StyledStylePicker = styled.div`
    position: fixed;
    top: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--color2);
    border-radius: var(--menubar-border-radius);
    height: fit-content;
    max-height: 20rem;
    min-width: 20rem;
    width: 70vw;
    max-width: 40rem;
    box-shadow: var(--box-shadow);

    /* .react-colorful {
        width: 100%;
        height: 100%;
    } */
`
