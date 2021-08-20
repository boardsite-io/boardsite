import styled from "styled-components"

export const StyledStylePicker = styled.div`
    display: flex;
    position: fixed;
    top: 50px;
    left: 50%;
    flex-direction: row;
    background: #00000088;
    border-radius: var(--menubar-border-radius);
    height: 200px;
    width: fit-content;
    gap: 5px;
    transform: translateX(-50%);
    padding: 5px;
    box-shadow: var(--box-shadow);
    justify-content: space-between;
`
