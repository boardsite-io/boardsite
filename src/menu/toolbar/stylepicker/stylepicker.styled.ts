import styled from "styled-components"

export const StyledStylePicker = styled.div`
    display: flex;
    gap: 0.4rem;
    position: fixed;
    top: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
    background: #00000088;
    border-radius: var(--menubar-border-radius);
    height: 200px;
    padding: 0.3rem;
    box-shadow: var(--box-shadow);
    justify-content: space-between;
`
